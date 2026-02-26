/**
 * groqParser.js
 *
 * Sends a batch of raw Telegram/Reddit messages to Groq in ONE API call.
 * This is a protein-supplement focused parser — it extracts deal data
 * AND classifies each post into a postType.
 *
 * Batching: 60s window, max 20 msgs → ~1440 calls/day (free tier = 1500/day)
 */
const axios = require('axios');
require('dotenv').config();

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

const SYSTEM_PROMPT = `You are a parser for an Indian protein supplement deals platform.

You receive messages from @protein_deals1 Telegram channel and fitness subreddits.
Return a JSON array — one object per message, in the SAME ORDER.

CRITICAL RULES FOR EXTRACTING LINKS AND IMAGES:
1. ONLY extract a 'link' or 'image' if the exact URL is VERBATIM present in the message text.
2. DO NOT hallucinate, guess, or construct URLs under any circumstances.
3. If a link or image URL is not explicitly in the text, you MUST return null.
4. Mark "isDeal": true for ANY genuinely protein/supplement-related post (including deals, restocks, price drops, reviews, freebies, and updates). 
5. ONLY mark "isDeal": false for completely off-topic messages, spam, or generic "join my channel" links.

For each message extract:
- "isDeal": true if it's about a protein/supplement product. false for: off-topic, spam, join links.
- "postType": Classify the post as one of:
    "Deal"      — a discount, sale, or coupon code offer
    "Restock"   — a product is back in stock
    "PriceDrop" — price has dropped (may not have explicit % off)
    "Review"    — a product review or recommendation
    "Freebie"   — free product, free shipping, free sample
    "Update"    — brand/product news, launch, or general update
    "Other"     — doesn't fit the above
- "title": Clean product name, max 100 chars. No emojis. e.g. "MuscleBlaze Whey Gold 2kg"
- "brand": Brand name e.g. MuscleBlaze, Optimum Nutrition, MyProtein, GNC, Dymatize, Nakpro, AS-IT-IS, Fast&Up. null if unclear.
- "store": Retailer e.g. Amazon, Flipkart, Healthkart, Myprotein.co.in, GNC India. null if unclear.
- "price": Deal price in INR as plain number. null if not mentioned.
- "originalPrice": MRP in INR as plain number. null if not mentioned.
- "discount": Discount % as plain number. Calculate from prices if not stated. null if unknown.
- "link": Product URL from message. null if none.
- "image": Direct image URL ending in .jpg/.jpeg/.png/.webp. null if none.
- "keyFeatures": Up to 3 short spec strings e.g. ["1kg", "24g protein/serving", "Chocolate Fudge"]. [] if none.
- "description": One sentence summary of the post. null if nothing useful.

Respond ONLY with a valid JSON array. No markdown, no backticks, no explanation.`;

async function parseDealWithGroq(messages) {
  if (!messages?.length) return [];

  if (!process.env.GROQ_API_KEY) {
    console.warn('[Groq] No GROQ_API_KEY — using regex fallback');
    return regexFallback(messages);
  }

  const numbered = messages
    .map((m, i) => `MSG_${i + 1} [${m.sourceChannel || 'unknown'}]:\n${(m.rawText || '').slice(0, 400)}`)
    .join('\n\n---\n\n');

  try {
    const res = await axios.post(GROQ_URL, {
      model: GROQ_MODEL,
      max_tokens: 8192,
      temperature: 0,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Parse these ${messages.length} messages:\n\n${numbered}` },
      ],
    }, {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    const raw = res.data.choices?.[0]?.message?.content?.trim() ?? '[]';
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.warn('[Groq] JSON truncated — attempting partial salvage');
      parsed = salvageTruncatedJSON(cleaned);
      if (!parsed.length) {
        console.error('[Groq] Salvage failed — regex fallback');
        return regexFallback(messages);
      }
    }

    if (!Array.isArray(parsed)) {
      console.error('[Groq] Not array — regex fallback');
      return regexFallback(messages);
    }

    const deals = [];
    for (let i = 0; i < parsed.length; i++) {
      const g = parsed[i];
      const src = messages[i] || {};

      // If the LLM explicitly says it's not a deal/relevant post, skip it.
      if (g?.isDeal === false) continue;

      // Sometimes LLMs fail to extract a title for generic posts (updates, etc). 
      // We shouldn't drop the entire post just because title is empty. Instead, fallback.
      let finalTitle = String(g.title || '').slice(0, 180).trim();
      if (!finalTitle) {
        finalTitle = g.description ? g.description.slice(0, 80) + '...' : (g.postType ? `${g.postType} Update` : 'Protein Update');
      }

      deals.push({
        title: finalTitle,
        description: g.description || '',
        brand: g.brand || null,
        store: g.store || 'Unknown',
        price: g.price != null ? Number(g.price) : null,
        originalPrice: g.originalPrice != null ? Number(g.originalPrice) : null,
        discount: g.discount != null ? Number(g.discount) : null,
        link: g.link || null,
        image: src.image || g.image || null,
        category: 'Protein',
        postType: g.postType || 'Deal',
        keyFeatures: Array.isArray(g.keyFeatures) ? g.keyFeatures.slice(0, 3) : [],
        source: src.source || 'telegram',
        sourceChannel: src.sourceChannel || '',
        rawText: src.rawText || '',
        createdAt: src._postTime ? new Date(src._postTime * 1000) : undefined,
      });
    }

    console.log(`[Groq] ${messages.length} msgs → ${deals.length} deals (postTypes: ${[...new Set(deals.map(d => d.postType))].join(', ')})`);
    return deals;

  } catch (err) {
    if (err.response?.status === 429) {
      console.warn('[Groq] Rate limited — regex fallback');
    } else {
      const detail = err.response?.data?.error?.message
        || err.response?.data?.error
        || err.response?.statusText
        || err.message
        || 'Unknown error';
      console.error('[Groq] API error:', detail);
    }
    return regexFallback(messages);
  }
}

function salvageTruncatedJSON(raw) {
  const results = [];
  const re = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)?\}/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    try {
      const obj = JSON.parse(m[0]);
      if (obj && typeof obj === 'object') results.push(obj);
    } catch { }
  }
  return results;
}

function regexFallback(messages) {
  try {
    const { parseDeal } = require('./parser');
    return messages.map(m => {
      const p = parseDeal(m.rawText || '', m.source || 'telegram');
      if (!p) return null;
      return {
        ...p,
        image: m.image || null,
        category: 'Protein',
        postType: 'Deal',
        sourceChannel: m.sourceChannel || '',
        rawText: m.rawText || '',
      };
    }).filter(Boolean);
  } catch (e) {
    console.error('[Groq] Regex fallback error:', e.message);
    return [];
  }
}

module.exports = { parseDealWithGroq };
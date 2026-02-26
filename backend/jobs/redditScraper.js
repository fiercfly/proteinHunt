/**
 * redditScraper.js
 *
 * Polls Indian deal subreddits every 10 minutes using Reddit's free public JSON API.
 * No API key needed. No auth. No persistent connection. Works on Render free tier.
 *
 * Reddit's public API: GET /r/subreddit/new.json
 * - Returns 25 newest posts by default
 * - Rate limit: ~60 req/min for unauthenticated — we poll every 10min so never hit it
 * - We track seen post IDs in memory to avoid reprocessing
 */

const axios = require('axios');
const Deal = require('../models/Deal');
const { parseDealWithGroq } = require('../scraper/groqParser');

// Subreddits to poll — all public Indian deal communities
// Protein/fitness subreddits — public, no auth needed
const SUBREDDITS = [
  { name: 'protein_deals', label: 'r/protein_deals' },
];

// In-memory set of Reddit post IDs we've already processed this session
// Prevents inserting the same post twice across poll cycles
const seenIds = new Set();

// How often to poll (milliseconds)
const POLL_INTERVAL = 10 * 60 * 1000; // 10 minutes

let pollTimer = null;

// ── Fetch latest posts from one subreddit ────────────────────────────────────
async function fetchSubreddit(subreddit) {
  try {
    const res = await axios.get(
      `https://www.reddit.com/r/${subreddit.name}/new.json?limit=25&sort=new`,
      {
        timeout: 10000,
        headers: {
          // Reddit requires a descriptive User-Agent or it may return 429
          'User-Agent': 'BestDeals/1.0 (deals aggregator; contact via github)',
        },
      }
    );

    const posts = res.data?.data?.children || [];
    return posts
      .filter(({ data: p }) => !p.stickied && !p.promoted && !p.is_video)
      .map(({ data: p }) => ({
        id: p.id,
        title: p.title,
        selftext: p.selftext || '',
        url: p.url,
        permalink: `https://reddit.com${p.permalink}`,
        score: p.score || 0,
        subreddit: subreddit.label,
        created_utc: p.created_utc || Date.now() / 1000,
      }));
  } catch (err) {
    console.warn(`[Reddit] Failed to fetch r/${subreddit.name}: ${err.message}`);
    return [];
  }
}

// ── One full poll cycle across all subreddits ────────────────────────────────
async function pollAll() {
  const allPosts = [];

  for (const sub of SUBREDDITS) {
    const posts = await fetchSubreddit(sub);
    const fresh = posts.filter(p => !seenIds.has(p.id));
    fresh.forEach(p => seenIds.add(p.id));
    allPosts.push(...fresh);
  }

  if (allPosts.length === 0) {
    console.log('[Reddit] No new posts this cycle');
    return;
  }

  console.log(`[Reddit] ${allPosts.length} new posts — sending to Groq…`);

  // Convert Reddit posts into the message format groqParser expects
  const messages = allPosts.map(post => ({
    // Combine title + body for better extraction
    rawText: `${post.title}\n\n${post.selftext}`.slice(0, 600),
    sourceChannel: post.subreddit,
    source: 'reddit',
    image: null,
    forceCategory: 'Protein', // entire app is protein-focused
    // Attach the Reddit post URL as the deal link hint
    _postUrl: post.permalink,
    _postScore: post.score,
    _postTime: post.created_utc,
  }));

  try {
    let deals = await parseDealWithGroq(messages);
    if (!deals?.length) { console.log('[Reddit] No deals extracted'); return; }

    // If Groq didn't find a link in the text, use the Reddit post URL as fallback
    deals = deals.map((deal, i) => ({
      ...deal,
      link: deal.link || messages[i]?._postUrl || '',
      votes: messages[i]?._postScore || 0,  // seed votes from Reddit score
      createdAt: deal.createdAt || undefined, // Allow custom timestamps
    }));

    let inserted = 0, skipped = 0;
    for (const deal of deals) {
      if (!deal.title) {
        console.log(`[Reddit] Skipped (no title):`, deal);
        skipped++;
        continue;
      }
      const dupe = await Deal.findOne({
        title: deal.title, store: deal.store || 'Unknown',
        createdAt: { $gte: new Date(Date.now() - 86400000) },
      });
      if (dupe) {
        console.log(`[Reddit] Skipped (DB dupe): ${deal.title}`);
        skipped++;
        continue;
      }
      try {
        await Deal.create(deal);
        inserted++;
      } catch (e) {
        console.error(`[Reddit] Skipped (Mongo Error - ${e.message}): ${deal.title}`);
        skipped++;
      }
    }

    console.log(`[Reddit] Saved ${inserted} deals, skipped ${skipped}`);
  } catch (err) {
    console.error('[Reddit] Groq/DB error:', err.message);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────
function startRedditScraper() {
  console.log(`[Reddit] Polling ${SUBREDDITS.map(s => s.label).join(', ')} every 10 min`);

  // Run immediately on startup (backfill recent posts)
  pollAll();

  // Then every 10 minutes
  pollTimer = setInterval(pollAll, POLL_INTERVAL);

  process.on('SIGINT', () => { clearInterval(pollTimer); process.exit(0); });
  process.on('SIGTERM', () => { clearInterval(pollTimer); process.exit(0); });
}

module.exports = { startRedditScraper };
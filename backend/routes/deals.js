const router = require('express').Router();
const Deal = require('../models/Deal');
const { protect, scraperAuth, optionalAuth, adminOnly } = require('../middleware/auth');

// GET /api/deals — list with filters + pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1, limit = 20,
      postType, brand, store, sort = 'newest',
      search, minDiscount, maxPrice, minPrice,
    } = req.query;

    const q = { isExpired: false };
    if (postType) q.postType = postType;
    if (brand) q.brand = new RegExp(brand, 'i');
    if (store) q.store = new RegExp(store, 'i');
    if (minDiscount) q.discount = { $gte: Number(minDiscount) };
    if (maxPrice || minPrice) {
      q.price = {};
      if (maxPrice) q.price.$lte = Number(maxPrice);
      if (minPrice) q.price.$gte = Number(minPrice);
    }
    if (search) q.$text = { $search: search };

    const sortMap = {
      newest: { createdAt: -1 },
      votes: { votes: -1 },
      discount: { discount: -1 },
      price: { price: 1 },
    };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Deal.countDocuments(q);
    const deals = await Deal.find(q)
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip).limit(Number(limit))
      .populate('submittedBy', 'name').lean();

    res.json({ deals, pagination: { total, page: Number(page), hasMore: skip + deals.length < total } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/deals/brands — distinct brands with counts for the sidebar
router.get('/brands', async (req, res) => {
  try {
    const brands = await Deal.aggregate([
      { $match: { isExpired: false, brand: { $ne: null } } },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 30 },
    ]);
    res.json(brands.map(b => ({ name: b._id, count: b.count })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/deals/posttypes — post type counts for the filter chips
router.get('/posttypes', async (req, res) => {
  try {
    const types = await Deal.aggregate([
      { $match: { isExpired: false } },
      { $group: { _id: '$postType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(types.map(t => ({ name: t._id, count: t.count })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/deals/:id
router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).populate('submittedBy', 'name').lean();
    if (!deal) return res.status(404).json({ error: 'Not found' });
    res.json(deal);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/deals/bulk — scraper batch insert
router.post('/bulk', scraperAuth, async (req, res) => {
  try {
    const { deals } = req.body;
    if (!Array.isArray(deals) || !deals.length)
      return res.status(400).json({ error: 'deals array required' });

    let inserted = 0, skipped = 0;
    for (const deal of deals) {
      if (!deal.title || !deal.source) {
        console.log(`[Bulk] Skipped (missing title/source):`, deal);
        skipped++;
        continue;
      }
      const dupe = await Deal.findOne({
        title: deal.title,
        store: deal.store || 'Unknown',
        createdAt: { $gte: new Date(Date.now() - 86400000) },
      });
      if (dupe) {
        console.log(`[Bulk] Skipped (DB dupe): ${deal.title}`);
        skipped++;
        continue;
      }
      try {
        await Deal.create({
          title: deal.title,
          description: deal.description || '',
          image: deal.image || '',
          price: deal.price ?? null,
          originalPrice: deal.originalPrice ?? null,
          discount: deal.discount ?? null,
          store: deal.store || 'Unknown',
          brand: deal.brand || null,
          link: deal.link || '',
          keyFeatures: deal.keyFeatures || [],
          category: 'Protein',
          postType: deal.postType || 'Deal',
          source: deal.source,
          sourceChannel: deal.sourceChannel || '',
          rawText: deal.rawText || '',
        });
        inserted++;
      } catch (e) {
        if (e.code === 11000) {
          console.log(`[Bulk] Skipped (11000 index dupe): ${deal.title}`);
          skipped++;
        }
        else console.error('[Bulk] Insert error:', e.message);
      }
    }
    console.log(`[Bulk] Saved ${inserted} deals, skipped ${skipped}`);
    res.json({ inserted, skipped });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/deals/submit — manual user submission
router.post('/submit', protect, async (req, res) => {
  try {
    const { title, description, link, price, originalPrice, store, brand, image, postType } = req.body;
    if (!title || !link) return res.status(400).json({ error: 'title and link required' });
    const discount = originalPrice && price
      ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;
    const deal = await Deal.create({
      title, description, link, price, originalPrice, discount,
      store, brand, image,
      category: 'Protein',
      postType: postType || 'Deal',
      source: 'manual',
      submittedBy: req.user._id,
    });
    res.status(201).json(deal);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/deals/:id/vote
router.post('/:id/vote', protect, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ error: 'Not found' });
    const uid = req.user._id.toString();
    const voted = deal.votedBy.map(v => v.toString()).includes(uid);
    if (voted) { deal.votedBy.pull(req.user._id); deal.votes = Math.max(0, deal.votes - 1); }
    else { deal.votedBy.push(req.user._id); deal.votes += 1; }
    await deal.save();
    res.json({ votes: deal.votes, voted: !voted });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PATCH /api/deals/:id — admin edit
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const allowed = ['isExpired', 'isFeatured', 'isVerified', 'postType', 'expiresAt'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const deal = await Deal.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!deal) return res.status(404).json({ error: 'Not found' });
    res.json(deal);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/deals/:id — admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Deal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
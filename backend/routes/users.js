const router = require('express').Router();
const User   = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/saved', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedDeals').lean();
    res.json(user.savedDeals || []);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/saved/:dealId', protect, async (req, res) => {
  try {
    const user    = await User.findById(req.user._id);
    const id      = req.params.dealId;
    const saved   = user.savedDeals.map(d => d.toString()).includes(id);
    saved ? user.savedDeals.pull(id) : user.savedDeals.push(id);
    await user.save();
    res.json({ saved: !saved });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
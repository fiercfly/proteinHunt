/**
 * cleanup.js
 * Deletes deals older than 3 days every 6 hours.
 * Also deletes deals with no title (malformed scrapes).
 * Called from server.js after MongoDB connects.
 */
const Deal = require('../models/Deal');

async function runCleanup() {
  try {
    const cutoff = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago

    const { deletedCount } = await Deal.deleteMany({
      $or: [
        {
          createdAt: { $lt: cutoff },
          postType: { $ne: 'Review' }
        },                                           // older than 10 days, but keep reviews
        { title: { $in: [null, '', undefined] } },   // malformed
      ],
    });

    if (deletedCount > 0)
      console.log(`[Cleanup] Removed ${deletedCount} old/malformed deals`);

  } catch (err) {
    console.error('[Cleanup] Error:', err.message);
  }
}

function startCleanupJob() {
  // Run once on boot, then every 6 hours
  runCleanup();
  setInterval(runCleanup, 6 * 60 * 60 * 1000);
  console.log('[Cleanup] Scheduled — runs every 6h, deletes deals >10 days old (keeps Reviews)');
}

module.exports = { startCleanupJob };
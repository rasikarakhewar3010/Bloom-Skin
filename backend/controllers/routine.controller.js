/**
 * =================================================================
 *  ROUTINE PLANNER CONTROLLER
 *  Auto-generates personalized AM/PM skincare routines based on
 *  the user's latest scan + recommendation engine output.
 *  Includes ingredient conflict detection and routine adaptation.
 * =================================================================
 */

const History = require('../models/history.model');
const { KNOWLEDGE_BASE, INGREDIENT_CONFLICTS } = require('../data/recommendationKnowledgeBase');

/**
 * Check ingredient conflicts between a list of ingredients.
 */
const detectConflicts = (ingredients) => {
  const conflicts = [];
  const names = ingredients.map((i) => i.name);

  names.forEach((ing) => {
    const incompatible = INGREDIENT_CONFLICTS[ing] || [];
    incompatible.forEach((conflict) => {
      if (names.includes(conflict)) {
        // Avoid duplicate pair reporting
        const existing = conflicts.find(
          (c) => (c.a === conflict && c.b === ing)
        );
        if (!existing) {
          conflicts.push({
            a: ing,
            b: conflict,
            warning: `Avoid using ${ing} and ${conflict} together — they can cause irritation or reduce effectiveness. Use them at different times of day.`,
          });
        }
      }
    });
  });

  return conflicts;
};

/**
 * Build a structured routine from condition-specific products.
 */
const buildRoutine = (conditions, history) => {
  const morningSteps = [];
  const nightSteps = [];
  const weeklySteps = [];
  const allIngredients = [];
  const avoidAll = new Set();

  // Collect products from top conditions
  conditions.forEach((condName) => {
    const kb = KNOWLEDGE_BASE[condName];
    if (!kb) return;

    kb.ingredients.forEach((ing) => {
      if (!allIngredients.find((i) => i.name === ing.name)) {
        allIngredients.push(ing);
      }
    });

    kb.avoidIngredients.forEach((ing) => avoidAll.add(ing));

    kb.products.forEach((prod) => {
      const step = {
        type: prod.type,
        product: prod.suggestion,
        usage: prod.usage,
        forCondition: condName,
        priority: prod.priority,
        buyLink: prod.buyLink || null,
        price: prod.price || null,
      };

      if (prod.type === 'Mask' || prod.usage.toLowerCase().includes('week')) {
        weeklySteps.push(step);
      } else if (prod.usage.toLowerCase().includes('night') || prod.usage.toLowerCase().includes('nightly')) {
        nightSteps.push(step);
        // Also add to morning if it says "morning and night"
        if (prod.usage.toLowerCase().includes('morning')) {
          morningSteps.push({ ...step });
        }
      } else if (prod.usage.toLowerCase().includes('morning')) {
        morningSteps.push(step);
      } else {
        // Default: add to both
        morningSteps.push({ ...step });
        nightSteps.push({ ...step });
      }
    });
  });

  // Deduplicate by product type (keep highest priority)
  const dedup = (steps) => {
    const map = new Map();
    steps.forEach((s) => {
      const key = s.type;
      if (!map.has(key) || map.get(key).priority < s.priority) {
        map.set(key, s);
      }
    });
    return [...map.values()].sort((a, b) => {
      const order = ['Cleanser', 'Exfoliant', 'Serum', 'Treatment', 'Spot Treatment', 'Moisturizer', 'Sunscreen'];
      return (order.indexOf(a.type) === -1 ? 99 : order.indexOf(a.type)) -
        (order.indexOf(b.type) === -1 ? 99 : order.indexOf(b.type));
    });
  };

  // --- Adaptation logic ---
  let adaptationNote = null;
  if (history.length >= 5) {
    const recent3 = history.slice(0, 3);
    const older3 = history.slice(-3);
    const recentClear = recent3.filter((h) => h.prediction === 'Clear Skin').length;
    const olderClear = older3.filter((h) => h.prediction === 'Clear Skin').length;

    if (recentClear > olderClear) {
      adaptationNote = {
        type: 'improving',
        message: '🎉 Your skin is showing improvement! Consider reducing treatment intensity gradually. You can switch from daily to every-other-day for active treatments.',
      };
    } else if (recentClear < olderClear) {
      adaptationNote = {
        type: 'worsening',
        message: '⚠️ Recent scans show increased skin concerns. Consider strengthening your routine or consulting a dermatologist for prescription options.',
      };
    }
  }

  const conflicts = detectConflicts(allIngredients);

  return {
    morning: dedup(morningSteps),
    night: dedup(nightSteps),
    weekly: weeklySteps.filter((v, i, a) => a.findIndex((t) => t.product === v.product) === i),
    conflicts,
    avoidIngredients: [...avoidAll],
    adaptationNote,
    activeIngredients: allIngredients.sort((a, b) => b.priority - a.priority).slice(0, 6),
  };
};

// @desc    Generate a personalized skincare routine
// @route   GET /api/routine
exports.getRoutine = async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id, deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(20);

    if (history.length === 0) {
      // Return a default maintenance routine
      const routine = buildRoutine(['Clear Skin'], []);
      return res.json({
        routine,
        basedOn: {
          conditions: ['Clear Skin'],
          totalScansAnalyzed: 0,
          message: 'This is a general maintenance routine. Complete a scan for personalized recommendations!',
        },
      });
    }

    // Identify top conditions from history
    const conditionCounts = {};
    history.forEach((h) => {
      if (h.prediction !== 'Invalid Image') {
        conditionCounts[h.prediction] = (conditionCounts[h.prediction] || 0) + 1;
      }
    });

    const sortedConditions = Object.entries(conditionCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    // Use top 2 conditions (or just the main one)
    const topConditions = sortedConditions.slice(0, 2);
    if (topConditions.length === 0) topConditions.push('Clear Skin');

    const routine = buildRoutine(topConditions, history);

    // Determine latest scan info
    const latestScan = history[0];
    const latestCondition = latestScan.prediction;
    const latestKb = KNOWLEDGE_BASE[latestCondition];

    res.json({
      routine,
      basedOn: {
        conditions: topConditions,
        latestScan: {
          prediction: latestScan.prediction,
          confidence: latestScan.confidence,
          date: latestScan.createdAt,
          description: latestKb?.description || '',
        },
        totalScansAnalyzed: history.length,
        message: `Your routine is customized for ${topConditions.join(' & ')}, based on your ${history.length} most recent scans.`,
      },
    });

  } catch (err) {

    res.status(500).json({ error: 'Failed to generate routine.' });
  }
};

// @desc    Track routine completion (AM or PM)
// @route   POST /api/routine/track
exports.trackRoutine = async (req, res) => {
  try {
    const { timeOfDay } = req.body; // 'am' or 'pm'
    if (!['am', 'pm'].includes(timeOfDay)) {
      return res.status(400).json({ error: "Invalid timeOfDay. Must be 'am' or 'pm'." });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    const now = new Date();
    
    // Streak calculation logic
    let streak = user.routineTracking?.streak || 0;
    const lastAm = user.routineTracking?.lastAmCompletion;
    const lastPm = user.routineTracking?.lastPmCompletion;
    
    // Simple streak logic: if they haven't completed anything in 48 hours, reset
    const lastAny = lastAm > lastPm ? lastAm : lastPm;
    if (lastAny) {
      const hoursSinceLast = (now - new Date(lastAny)) / (1000 * 60 * 60);
      if (hoursSinceLast > 48) {
        streak = 0; // Streak broken
      }
      
      // If it's a new day and they completed the first routine of the day, increment streak
      const lastDate = new Date(lastAny).toDateString();
      const todayDate = now.toDateString();
      if (lastDate !== todayDate) {
        streak += 1;
      }
    } else {
      // First time completing a routine
      streak = 1;
    }

    // Update tracking
    const updateField = timeOfDay === 'am' ? 'lastAmCompletion' : 'lastPmCompletion';
    
    user.routineTracking = {
      ...(user.routineTracking?.toObject?.() || user.routineTracking || {}),
      [updateField]: now,
      streak
    };

    await user.save();

    res.json({
      message: `${timeOfDay.toUpperCase()} Routine tracked!`,
      routineTracking: user.routineTracking
    });
  } catch (err) {
    console.error("Track routine error:", err);
    res.status(500).json({ error: 'Failed to track routine.' });
  }
};

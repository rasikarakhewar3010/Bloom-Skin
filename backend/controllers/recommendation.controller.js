/**
 * =================================================================
 *  RECOMMENDATION CONTROLLER
 *  Analyzes user history to generate personalized skincare
 *  recommendations weighted by condition frequency, recency,
 *  and severity trends.
 * =================================================================
 */

const History = require('../models/history.model');
const User = require('../models/User');
const { KNOWLEDGE_BASE } = require('../data/recommendationKnowledgeBase');
const { computeBloomScore } = require('../utils/bloomScore');

/**
 * Compute a recency weight — more recent scans matter more.
 * Returns a value between 0.1 (old) and 1.0 (today).
 */
const computeRecencyWeight = (dateStr) => {
  const daysDiff = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff <= 7) return 1.0;
  if (daysDiff <= 30) return 0.8;
  if (daysDiff <= 90) return 0.5;
  return 0.2;
};

/**
 * Determine trend direction from an array of confidence values (oldest→newest).
 */
const computeTrend = (confidences) => {
  if (confidences.length < 2) return 'stable';
  const recent = confidences.slice(-3);
  const earlier = confidences.slice(0, Math.min(3, confidences.length - 1));
  const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
  const avgEarlier = earlier.reduce((a, b) => a + b, 0) / earlier.length;
  const diff = avgRecent - avgEarlier;
  if (diff > 0.05) return 'worsening';
  if (diff < -0.05) return 'improving';
  return 'stable';
};

// @desc    Get personalized recommendations based on user history
// @route   GET /api/recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id, deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(50);

    // --- If no history, return general skincare tips ---
    if (history.length === 0) {
      const clearSkinData = KNOWLEDGE_BASE['Clear Skin'];
      return res.json({
        summary: {
          totalScans: 0,
          topCondition: null,
          overallTrend: 'none',
          bloomScore: 100,
          message: 'Start your first scan to get personalized recommendations!',
        },
        recommendations: {
          ingredients: clearSkinData.ingredients,
          products: clearSkinData.products,
          tips: clearSkinData.tips,
          avoidIngredients: [],
        },
        conditionBreakdown: [],
      });
    }

    // --- Build condition frequency map with recency weighting ---
    const conditionMap = {};
    const allConditions = [];

    history.forEach((entry) => {
      const { prediction, confidence, createdAt } = entry;
      if (prediction === 'Invalid Image' || prediction === 'Clear Skin') {
        allConditions.push({ prediction, confidence, date: createdAt });
        return;
      }

      const recencyWeight = computeRecencyWeight(createdAt);
      const severityWeight = KNOWLEDGE_BASE[prediction]?.severityWeight || 1;
      const weightedScore = confidence * recencyWeight * severityWeight;

      if (!conditionMap[prediction]) {
        conditionMap[prediction] = {
          count: 0,
          totalScore: 0,
          confidences: [],
          lastSeen: createdAt,
        };
      }
      conditionMap[prediction].count += 1;
      conditionMap[prediction].totalScore += weightedScore;
      conditionMap[prediction].confidences.push(confidence);
      allConditions.push({ prediction, confidence, date: createdAt });
    });

    // --- Rank conditions by weighted score ---
    const rankedConditions = Object.entries(conditionMap)
      .map(([name, data]) => ({
        name,
        count: data.count,
        avgConfidence: data.confidences.reduce((a, b) => a + b, 0) / data.confidences.length,
        trend: computeTrend(data.confidences.reverse()), // oldest to newest
        weightedScore: data.totalScore,
        lastSeen: data.lastSeen,
        percentage: Math.round((data.count / history.length) * 100),
        icon: KNOWLEDGE_BASE[name]?.icon || 'https://cdn-icons-png.flaticon.com/512/3233/3233497.png'
      }))
      .sort((a, b) => b.weightedScore - a.weightedScore);


    // --- Bloom Score (shared computation — same as Dashboard) ---
    const bloomScore = computeBloomScore(history);

    // --- Aggregate recommendations from top conditions ---
    const topConditions = rankedConditions.slice(0, 3);
    const ingredientMap = new Map();
    const productMap = new Map();
    const allTips = [];
    const allAvoidIngredients = new Set();

    topConditions.forEach((condition) => {
      const kb = KNOWLEDGE_BASE[condition.name];
      if (!kb) return;

      const conditionWeight = condition.weightedScore;

      kb.ingredients.forEach((ing) => {
        const key = ing.name;
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key);
          existing.priority = Math.max(existing.priority, ing.priority);
          existing.relevantConditions.push(condition.name);
        } else {
          ingredientMap.set(key, {
            ...ing,
            relevantConditions: [condition.name],
            combinedScore: ing.priority * conditionWeight,
          });
        }
      });

      kb.products.forEach((prod) => {
        const key = `${prod.type}-${prod.suggestion}`;
        if (!productMap.has(key)) {
          productMap.set(key, {
            ...prod,
            relevantCondition: condition.name,
          });
        }
      });

      allTips.push(...kb.tips.map((tip) => ({ text: tip, condition: condition.name })));
      kb.avoidIngredients.forEach((ing) => allAvoidIngredients.add(ing));
    });

    // --- Sort and deduplicate ---
    const sortedIngredients = [...ingredientMap.values()]
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8);

    const sortedProducts = [...productMap.values()]
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 10);

    // Deduplicate tips
    const uniqueTips = [];
    const seenTips = new Set();
    allTips.forEach((tip) => {
      if (!seenTips.has(tip.text)) {
        seenTips.add(tip.text);
        uniqueTips.push(tip);
      }
    });

    // --- Overall trend ---
    const overallTrend = rankedConditions.length > 0
      ? rankedConditions[0].trend
      : 'stable';

    const trendMessage = {
      improving: '📈 Great news! Your skin condition appears to be improving.',
      worsening: '📉 Your recent scans show some changes. Consider adjusting your routine.',
      stable: '➡️ Your skin condition has been relatively stable.',
    };

    // --- Dynamic Skin Overview (Moved from Frontend for true real-time) ---
    const userProfile = await User.findById(req.user.id);
    const skinType = userProfile?.skinProfile?.skinType || 'normal';
    
    const skinOverview = [
      { 
        label: 'Hydration', 
        value: skinType === 'dry' ? 'Needs care' : 'Good', 
        icon: '💧' 
      },
      { 
        label: 'Oil Balance', 
        value: skinType === 'oily' ? 'Moderate' : 'Balanced', 
        icon: '✨' 
      },
      { 
        label: 'Sensitivity', 
        value: skinType === 'sensitive' ? 'Moderate' : 'Balanced', 
        icon: '🛡️' 
      },
      { 
        label: 'Clarity', 
        value: bloomScore >= 80 ? 'Good' : bloomScore >= 50 ? 'Moderate' : 'Needs care', 
        icon: '🎯' 
      },
    ];

    res.json({
      summary: {
        totalScans: history.length,
        topCondition: rankedConditions[0]?.name || 'Clear Skin',
        overallTrend,
        trendMessage: trendMessage[overallTrend],
        bloomScore,
        skinOverview, // New dynamic data
        message: bloomScore >= 80
          ? 'Your skin health is looking great! Keep up your routine.'
          : bloomScore >= 50
            ? 'Your skin needs some attention. Follow the recommendations below.'
            : 'We recommend focusing on the treatment plan below and consulting a dermatologist.',
      },
      recommendations: {
        ingredients: sortedIngredients,
        products: sortedProducts,
        tips: uniqueTips.slice(0, 8),
        avoidIngredients: [...allAvoidIngredients],
      },
      conditionBreakdown: rankedConditions,
    });


  } catch (err) {

    res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
};

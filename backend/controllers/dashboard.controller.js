/**
 * =================================================================
 *  DASHBOARD CONTROLLER
 *  Computes aggregated stats, timeline data, condition frequency,
 *  and Bloom Score from user scan history.
 * =================================================================
 */

const History = require('../models/history.model');
const { KNOWLEDGE_BASE } = require('../data/recommendationKnowledgeBase');
const { computeBloomScore } = require('../utils/bloomScore');

// @desc    Get dashboard stats for authenticated user
// @route   GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id, deletedAt: null })
      .sort({ createdAt: 1 }); // oldest first for timeline

    if (history.length === 0) {
      return res.json({
        bloomScore: 100,
        totalScans: 0,
        streak: 0,
        conditionFrequency: [],
        timeline: [],
        severityTrend: [],
        recentScans: [],
        insights: {
          mostCommon: null,
          trendDirection: 'none',
          averageConfidence: 0,
          scanFrequency: 'No scans yet',
          lastScanDate: null,
        },
      });
    }

    // --- Condition Frequency ---
    const conditionCounts = {};
    let totalConditionScans = 0;
    history.forEach((h) => {
      if (h.prediction !== 'Invalid Image') {
        conditionCounts[h.prediction] = (conditionCounts[h.prediction] || 0) + 1;
        totalConditionScans++;
      }
    });

    const conditionFrequency = Object.entries(conditionCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalConditionScans) * 100),
        color: getConditionColor(name),
      }))
      .sort((a, b) => b.count - a.count);

    // --- Timeline data (group by week) ---
    const weeklyData = {};
    history.forEach((h) => {
      if (h.prediction === 'Invalid Image') return;
      const weekStart = getWeekStart(new Date(h.createdAt));
      const key = weekStart.toISOString().split('T')[0];
      if (!weeklyData[key]) {
        weeklyData[key] = { date: key, scans: 0, avgConfidence: 0, conditions: {}, confidences: [] };
      }
      weeklyData[key].scans += 1;
      weeklyData[key].confidences.push(h.confidence);
      weeklyData[key].conditions[h.prediction] = (weeklyData[key].conditions[h.prediction] || 0) + 1;
    });

    const timeline = Object.values(weeklyData).map((week) => ({
      date: week.date,
      scans: week.scans,
      avgConfidence: +(week.confidences.reduce((a, b) => a + b, 0) / week.confidences.length).toFixed(3),
      topCondition: Object.entries(week.conditions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Clear Skin',
    }));

    // --- Severity trend (per scan, newest last) ---
    const severityTrend = history
      .filter((h) => h.prediction !== 'Invalid Image' && h.prediction !== 'Clear Skin')
      .map((h) => ({
        date: h.createdAt,
        confidence: h.confidence,
        prediction: h.prediction,
        severity: h.severity || computeSeverityFromConfidence(h.confidence),
      }));

    // --- Bloom Score (shared computation) ---
    const bloomScore = computeBloomScore(history);

    // --- Scanning Streak ---
    const streak = computeStreak(history);

    // --- Scan frequency insight ---
    const daysBetween = (new Date(history[history.length - 1].createdAt) - new Date(history[0].createdAt)) / (1000 * 60 * 60 * 24);
    let scanFrequency;
    if (history.length === 1) {
      scanFrequency = 'Just started';
    } else if (daysBetween / history.length <= 3) {
      scanFrequency = 'Very active (scanning every few days)';
    } else if (daysBetween / history.length <= 7) {
      scanFrequency = 'Active (weekly scans)';
    } else {
      scanFrequency = 'Occasional (scan more often for better insights)';
    }

    // --- Trend detection ---
    let trendDirection = 'stable';
    if (severityTrend.length >= 3) {
      const recentAvg = severityTrend.slice(-3).reduce((s, t) => s + t.confidence, 0) / 3;
      const olderAvg = severityTrend.slice(0, 3).reduce((s, t) => s + t.confidence, 0) / Math.min(3, severityTrend.length);
      if (recentAvg - olderAvg > 0.05) trendDirection = 'worsening';
      else if (olderAvg - recentAvg > 0.05) trendDirection = 'improving';
    }

    // --- Recent scans (last 5) ---
    const recentScans = [...history].reverse().slice(0, 5).map((h) => ({
      id: h._id,
      prediction: h.prediction,
      confidence: h.confidence,
      severity: h.severity || computeSeverityFromConfidence(h.confidence),
      imageUrl: h.imageUrl,
      date: h.createdAt,
    }));
    const conditionEntries = history.filter(h => h.prediction !== 'Clear Skin' && h.prediction !== 'Invalid Image');
    const clearCount = history.filter(h => h.prediction === 'Clear Skin').length;

    const firstScan = history[0] ? {
      id: history[0]._id,
      prediction: history[0].prediction,
      imageUrl: history[0].imageUrl,
      date: history[0].createdAt,
    } : null;

    res.json({
      bloomScore,
      totalScans: history.length,
      streak,
      conditionFrequency,
      timeline,
      severityTrend,
      recentScans,
      firstScan,
      insights: {
        mostCommon: conditionFrequency[0]?.name || 'Clear Skin',
        trendDirection,
        averageConfidence: +(conditionEntries.reduce((s, h) => s + h.confidence, 0) / Math.max(conditionEntries.length, 1)).toFixed(3),
        scanFrequency,
        lastScanDate: history[history.length - 1].createdAt,
        clearSkinPercentage: Math.round((clearCount / history.length) * 100),
      },
    });

  } catch (err) {

    res.status(500).json({ error: 'Failed to compute dashboard stats.' });
  }
};

// --- HELPERS ---

function getWeekStart(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function computeStreak(history) {
  if (history.length === 0) return 0;
  const sortedDates = [...new Set(
    history.map((h) => new Date(h.createdAt).toISOString().split('T')[0])
  )].sort().reverse();
  
  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const curr = new Date(sortedDates[i - 1]);
    const prev = new Date(sortedDates[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diffDays <= 7) { // Weekly streak
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function computeSeverityFromConfidence(confidence) {
  if (confidence >= 0.95) return 'severe';
  if (confidence >= 0.90) return 'high';
  if (confidence >= 0.80) return 'moderate';
  return 'low';
}

function getConditionColor(name) {
  const colors = {
    'Blackheads': '#6B7280',
    'Whiteheads': '#F59E0B',
    'Papules': '#EF4444',
    'Pustules': '#F97316',
    'Cyst': '#DC2626',
    'Clear Skin': '#10B981',
  };
  return colors[name] || '#8B5CF6';
}

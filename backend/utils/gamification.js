// utils/gamification.js

const BADGE_RULES = {
  "first-review": { label: "Storyteller", icon: "✍️", check: (user, stats) => stats.reviewCount >= 1 },
  "collector": { label: "Collector", icon: "❤️", check: (user) => (user.favorites?.length || 0) >= 5 },
  "ar-explorer": { label: "AR Explorer", icon: "📱", check: (user, stats) => stats.arUses >= 1 },
  "streak-7": { label: "7-Day Streak", icon: "🔥", check: (user) => (user.streak?.current || 0) >= 7 },
  "streak-30": { label: "30-Day Streak", icon: "⚡", check: (user) => (user.streak?.current || 0) >= 30 },
};

export function awardBadges(user, stats = {}) {
  const existing = new Set((user.badges || []).map((b) => b.id));
  const newBadges = [];

  for (const [id, rule] of Object.entries(BADGE_RULES)) {
    if (!existing.has(id) && rule.check(user, stats)) {
      newBadges.push({ id, earnedAt: new Date() });
    }
  }

  if (newBadges.length > 0) {
    user.badges = [...(user.badges || []), ...newBadges];
  }

  return newBadges.map((b) => ({ id: b.id, label: BADGE_RULES[b.id].label, icon: BADGE_RULES[b.id].icon }));
}

export function updateStreak(user) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!user.streak) {
    user.streak = { current: 0, longest: 0, lastVisitDate: null };
  }

  const last = user.streak.lastVisitDate ? new Date(user.streak.lastVisitDate) : null;
  if (last) last.setHours(0, 0, 0, 0);

  if (!last) {
    user.streak.current = 1;
  } else {
    const diffDays = Math.round((today - last) / 86400000);
    if (diffDays === 1) {
      user.streak.current += 1;
    } else if (diffDays > 1) {
      user.streak.current = 1;
    }
    // diffDays === 0 → already counted today, no change
  }

  user.streak.lastVisitDate = today;
  user.streak.longest = Math.max(user.streak.longest || 0, user.streak.current);

  return user.streak;
}

export { BADGE_RULES };

export default { awardBadges, updateStreak, BADGE_RULES };
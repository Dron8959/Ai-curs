// Draft posting schedule for the Instagram desk: 3 slots a day, New York time. Proposed, not set in Metricool.
// Day 1 = Monday 16 November 2026. Posts 1 and 4 stand on facts the owner has not confirmed, so they go last.
export const SLOTS = [['08:00', 'morning'], ['12:30', 'lunch'], ['19:30', 'evening']];
export const START = '2026-11-16';
// post number -> [day index from 0, slot index]
export const PLAN = { 2: [0, 0], 3: [0, 1], 5: [0, 2], 6: [1, 0], 7: [1, 1], 8: [1, 2], 9: [2, 0], 10: [2, 1], 1: [3, 0], 4: [3, 1] };
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function slotOf(n) {
  const p = PLAN[n]; if (!p) return null;
  const d = new Date(START + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + p[0]);
  return { iso: d.toISOString().slice(0, 10), time: SLOTS[p[1]][0], part: SLOTS[p[1]][1], text: `${DAYS[(d.getUTCDay() + 6) % 7]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]}, ${SLOTS[p[1]][0]} New York` };
}

// The live Instagram schedule of the first ten posts, as set in Metricool on 14 Nov 2026 (owner: two a day from today).
// New York time. id = the Metricool post id. Post 4 is a draft until Anna confirms the 7:02 to 7:41 story.
export const LIVE = {
  1: ['2026-11-14', '08:00', 427871058], 3: ['2026-11-14', '12:30', 427872441],
  2: ['2026-11-15', '12:30', 427930479], 5: ['2026-11-15', '19:30', 427931803],
  7: ['2026-11-16', '12:30', 427931857], 8: ['2026-11-16', '19:30', 427931887],
  6: ['2026-11-17', '12:30', 427931908], 9: ['2026-11-17', '19:30', 427931948],
  10: ['2026-11-18', '12:30', 427931977], 4: ['2026-11-18', '19:30', 427934627],
};
export const DRAFT = new Set([4]);
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function slotOf(n) {
  const p = LIVE[n]; if (!p) return null;
  const d = new Date(p[0] + 'T12:00:00Z');
  return { iso: p[0], time: p[1], id: p[2], text: `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]}, ${p[1]} New York${DRAFT.has(n) ? ' (draft)' : ''}` };
}

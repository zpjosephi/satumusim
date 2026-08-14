// 2018/19 Premier League title race, computed from the xeleven match archive
// (data/matches.json) and cross-checked against its standings file.

export const SEASON = "2018/19";
export const WEEKS = 38;

export type RaceLine = {
  team: string;
  short: string;
  color: string;
  byWeek: number[]; // cumulative points after each matchweek
};

export const RACE: RaceLine[] = [
  {
    team: "Manchester City",
    short: "Man City",
    color: "var(--city)",
    byWeek: [
      3, 6, 7, 10, 13, 16, 19, 20, 23, 26, 29, 32, 35, 38, 41, 41, 44, 44, 44,
      47, 50, 53, 56, 56, 59, 62, 65, 68, 71, 74, 77, 80, 83, 86, 89, 92, 95, 98,
    ],
  },
  {
    team: "Liverpool",
    short: "Liverpool",
    color: "var(--liv)",
    byWeek: [
      3, 6, 9, 12, 15, 18, 19, 20, 23, 26, 27, 30, 33, 36, 39, 42, 45, 48, 51,
      54, 54, 57, 60, 61, 62, 65, 66, 69, 70, 73, 76, 79, 82, 85, 88, 91, 94, 97,
    ],
  },
];

// story beats keyed to the pinned chart's scrub progress (week / WEEKS)
export type Beat = { week: number; title: string; body: string };

export const BEATS: Beat[] = [
  {
    week: 6,
    title: "A perfect start, twice",
    body: "Both sides open the season without losing. Liverpool win six straight; City drop two points in a draw at Wolves. Nobody blinks.",
  },
  {
    week: 20,
    title: "Seven points clear at Christmas",
    body: "City lose three times in December, at Chelsea, Palace and Leicester. Liverpool keep winning, and by week 20 the gap is seven points.",
  },
  {
    week: 24,
    title: "The door opens, then slams shut",
    body: "City win the head-to-head 2-1, then stumble again at Newcastle. Liverpool answer with two draws, not two wins, and the chance to pull away is gone.",
  },
  {
    week: 29,
    title: "One point ahead, ten to play",
    body: "City edge in front for the first time since November. From here neither team drops a single point. Fourteen straight wins for City.",
  },
  {
    week: 38,
    title: "98 to 97",
    body: "Liverpool lose once all season, score 89, concede 22, and still finish second. The margin after 380 matches: one point.",
  },
];

export type FinalRow = {
  team: string;
  pts: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  color?: string;
};

export const FINAL_TOP6: FinalRow[] = [
  { team: "Manchester City", pts: 98, w: 32, d: 2, l: 4, gf: 95, ga: 23, gd: 72, color: "var(--city)" },
  { team: "Liverpool", pts: 97, w: 30, d: 7, l: 1, gf: 89, ga: 22, gd: 67, color: "var(--liv)" },
  { team: "Chelsea", pts: 72, w: 21, d: 9, l: 8, gf: 63, ga: 39, gd: 24 },
  { team: "Tottenham Hotspur", pts: 71, w: 23, d: 2, l: 13, gf: 67, ga: 39, gd: 28 },
  { team: "Arsenal", pts: 70, w: 21, d: 7, l: 10, gf: 73, ga: 51, gd: 22 },
  { team: "Manchester Utd", pts: 66, w: 19, d: 9, l: 10, gf: 65, ga: 54, gd: 11 },
];

// City's 14 straight wins from matchweek 25 to the end, in week order
export type StreakMatch = { wk: number; opp: string; venue: "H" | "A"; score: string };

export const STREAK: StreakMatch[] = [
  { wk: 25, opp: "Arsenal", venue: "H", score: "3-1" },
  { wk: 26, opp: "Chelsea", venue: "H", score: "6-0" },
  { wk: 27, opp: "Everton", venue: "A", score: "2-0" },
  { wk: 28, opp: "West Ham", venue: "H", score: "1-0" },
  { wk: 29, opp: "Bournemouth", venue: "A", score: "1-0" },
  { wk: 30, opp: "Watford", venue: "H", score: "3-1" },
  { wk: 31, opp: "Man United", venue: "A", score: "2-0" },
  { wk: 32, opp: "Fulham", venue: "A", score: "2-0" },
  { wk: 33, opp: "Cardiff", venue: "H", score: "2-0" },
  { wk: 34, opp: "Crystal Palace", venue: "A", score: "3-1" },
  { wk: 35, opp: "Tottenham", venue: "H", score: "1-0" },
  { wk: 36, opp: "Burnley", venue: "A", score: "1-0" },
  { wk: 37, opp: "Leicester", venue: "H", score: "1-0" },
  { wk: 38, opp: "Brighton", venue: "A", score: "4-1" },
];

// the final day, May 12 2019: what each scoreline meant for the title
export const FINAL_DAY = [
  {
    time: "15:00",
    board: [
      { fix: "Brighton 0-0 Man City", color: "var(--city)" },
      { fix: "Liverpool 0-0 Wolves", color: "var(--liv)" },
    ],
    title: "Ninety minutes for the title",
    body: "City must win at Brighton. Anything less, and a Liverpool win takes the trophy to Anfield.",
  },
  {
    time: "27'",
    board: [
      { fix: "Brighton 1-0 Man City", color: "var(--city)" },
      { fix: "Liverpool 1-0 Wolves", color: "var(--liv)" },
    ],
    title: "For 83 seconds, the title is Liverpool's",
    body: "Glenn Murray heads Brighton in front. As it stands, Liverpool are champions.",
  },
  {
    time: "FT",
    board: [
      { fix: "Brighton 1-4 Man City", color: "var(--city)" },
      { fix: "Liverpool 2-0 Wolves", color: "var(--liv)" },
    ],
    title: "98 to 97",
    body: "Aguero answers within 83 seconds, and City score three more. Both teams win. Only one of them counts.",
  },
];

export const STATS = [
  { value: 14, label: "consecutive City wins to close the season" },
  { value: 1, label: "Liverpool defeat in 38 matches" },
  { value: 184, label: "goals scored by the two of them combined" },
  { value: 25, label: "points between second place and third" },
];

export type BadgeId =
  | "first-correct"
  | "combo-5"
  | "combo-10"
  | "perfect-quest"
  | "world-tour"
  | "boss-slayer"
  | "legend"
  | "lightning"
  | "speed-matcher"
  | "card-shark"
  | "mistake-fixer"
  | "streak-3"
  | "streak-7";

export interface Badge {
  id: BadgeId;
  name: string;
  icon: string;
  description: string;
}

export const BADGES: Badge[] = [
  { id: "first-correct", name: "Hello, World", icon: "🌱", description: "Answer your first question correctly" },
  { id: "combo-5", name: "On Fire", icon: "🔥", description: "Hit a 5-answer combo" },
  { id: "combo-10", name: "Unstoppable", icon: "☄️", description: "Hit a 10-answer combo" },
  { id: "perfect-quest", name: "Flawless", icon: "💎", description: "Finish a quest with 3 stars" },
  { id: "world-tour", name: "World Tour", icon: "🗺️", description: "Complete a quest in all 5 worlds" },
  { id: "boss-slayer", name: "Boss Slayer", icon: "⚔️", description: "Score 700+ on the Boss Battle (passing score)" },
  { id: "legend", name: "Legend", icon: "👑", description: "Score 900+ on the Boss Battle" },
  { id: "lightning", name: "Lightning Brain", icon: "⚡", description: "Get 12+ right in one Lightning Round" },
  { id: "speed-matcher", name: "Speed Matcher", icon: "🧩", description: "Clear Service Match in 45 seconds or less" },
  { id: "card-shark", name: "Card Shark", icon: "🃏", description: "Get 25 flashcards to box 4 or higher" },
  { id: "mistake-fixer", name: "Comeback Kid", icon: "🔁", description: "Fix 10 questions you previously missed" },
  { id: "streak-3", name: "Habit Forming", icon: "📅", description: "Study 3 days in a row" },
  { id: "streak-7", name: "Week Warrior", icon: "🏆", description: "Study 7 days in a row" },
];

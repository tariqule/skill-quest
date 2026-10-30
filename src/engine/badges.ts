export type BadgeId =
  | "orientation"
  | "scholar"
  | "certified"
  | "bookworm"
  | "tinkerer"
  | "arcade"
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
  { id: "orientation", name: "Recruit", icon: "🧭", description: "Finish the intro briefing" },
  { id: "scholar", name: "Scholar", icon: "📖", description: "Finish every lesson on the path" },
  { id: "certified", name: "Gatekeeper", icon: "🏛️", description: "Pass the full exam simulation" },
  { id: "bookworm", name: "Bookworm", icon: "📚", description: "Study for 60 minutes in total" },
  { id: "tinkerer", name: "Tinkerer", icon: "🧪", description: "Solve 5 hands-on lab challenges" },
  { id: "arcade", name: "Arcade Explorer", icon: "🕹️", description: "Play the mini game in every section" },
  { id: "first-correct", name: "Hello, World", icon: "🌱", description: "Answer your first question correctly" },
  { id: "combo-5", name: "On Fire", icon: "🔥", description: "Hit a 5-answer combo" },
  { id: "combo-10", name: "Unstoppable", icon: "☄️", description: "Hit a 10-answer combo" },
  { id: "perfect-quest", name: "Flawless", icon: "💎", description: "Finish a quest with 3 stars" },
  { id: "world-tour", name: "World Tour", icon: "🗺️", description: "Earn a star in every world" },
  { id: "boss-slayer", name: "Boss Slayer", icon: "⚔️", description: "Reach the passing score in the Boss Battle" },
  { id: "legend", name: "Legend", icon: "👑", description: "Score well above the pass mark in the Boss Battle" },
  { id: "lightning", name: "Lightning Brain", icon: "⚡", description: "Hit the target score in one Lightning Round" },
  { id: "speed-matcher", name: "Speed Matcher", icon: "🧩", description: "Clear Service Match against the clock" },
  { id: "card-shark", name: "Card Shark", icon: "🃏", description: "Get a deck of flashcards to box 4 or higher" },
  { id: "mistake-fixer", name: "Comeback Kid", icon: "🔁", description: "Fix 10 questions you previously missed" },
  { id: "streak-3", name: "Habit Forming", icon: "📅", description: "Study 3 days in a row" },
  { id: "streak-7", name: "Week Warrior", icon: "🏆", description: "Study 7 days in a row" },
];

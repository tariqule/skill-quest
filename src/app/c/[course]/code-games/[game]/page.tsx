import { GamePlay } from "./GamePlay";

export function generateStaticParams() {
  return ["parsons", "bug", "output", "mix"].map((game) => ({ game }));
}

export default function CodeGamePage() {
  return <GamePlay />;
}

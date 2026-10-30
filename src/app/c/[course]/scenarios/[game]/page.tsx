import { ScenarioGame } from "./ScenarioGame";

export function generateStaticParams() {
  return ["architect", "chain", "matcher", "interview"].map((game) => ({ game }));
}

export default function ScenarioGamePage() {
  return <ScenarioGame />;
}

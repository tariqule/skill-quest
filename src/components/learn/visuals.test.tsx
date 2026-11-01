import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Ladder, SeverityScale } from "./blocks";

const rungs = [
  { icon: "a", name: "Top", text: "one" },
  { icon: "b", name: "Bottom", text: "two" },
];

describe("lesson visuals", () => {
  it("Ladder shows cost marks only when asked", () => {
    const plain = renderToStaticMarkup(<Ladder rungs={rungs} caption="each one sits inside the one below" />);
    expect(plain).not.toMatch(/\$|cost/);
    expect(renderToStaticMarkup(<Ladder rungs={rungs} dollars />)).toMatch(/\$/);
  });

  it("SeverityScale blocks every level from the setting's threshold up", () => {
    const html = renderToStaticMarkup(
      <SeverityScale
        levels={[
          { name: "Safe", color: "", text: "" },
          { name: "Low", color: "", text: "" },
          { name: "Medium", color: "", text: "" },
          { name: "High", color: "", text: "" },
        ]}
        settings={[{ name: "Block low and up", blocksFrom: 1 }]}
      />,
    );
    expect(html.match(/>blocked</g)).toHaveLength(3);
    expect(html.match(/>allowed</g)).toHaveLength(1);
    expect(html).not.toMatch(/\$|cost/);
  });
});

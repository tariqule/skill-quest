import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { STAR_PRIMER } from "@/engine/scenarios";
import { RichText } from "./code";

const html = (t: string) => renderToStaticMarkup(<RichText text={t} />);

describe("RichText emphasis", () => {
  it("renders *em* and **bold** without literal asterisks", () => {
    const out = html(STAR_PRIMER[2]);
    expect(out).toContain("<strong");
    expect(out).toContain('<em class="italic">you</em>');
    expect(out).not.toContain("*");
    expect(html('Says what *you* did with "I".')).toContain("<em");
  });
  it("leaves arithmetic and pointer types alone", () => {
    expect(html("a * b * c")).toBe("a * b * c");
    expect(html("Returning a nil *MyErr as error gives (type=*MyErr, value=nil)")).not.toContain("<em");
  });
});

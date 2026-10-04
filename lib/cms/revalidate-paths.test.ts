import { describe, it, expect } from "vitest";
import { publicPathsToRevalidate } from "@/lib/cms/revalidate-paths";

// Pages live under app/[locale]; with localePrefix "as-needed" the public URL
// /blog/x is a rewrite of /cs/blog/x, and revalidatePath needs the latter.
describe("publicPathsToRevalidate", () => {
  it("blog post: article, blog list and homepage, per locale", () => {
    expect(publicPathsToRevalidate("BLOG_POST", "novy-poplatek", ["cs"]).sort()).toEqual(
      ["/cs", "/cs/blog", "/cs/blog/novy-poplatek"].sort(),
    );
  });
  it("faq: answer and poradna list", () => {
    expect(publicPathsToRevalidate("FAQ", "insolvence", ["cs"]).sort()).toEqual(["/cs/faq", "/cs/faq/insolvence"].sort());
  });
  it("endorsement: homepage only", () => {
    expect(publicPathsToRevalidate("ENDORSEMENT", "x", ["cs"])).toEqual(["/cs"]);
  });
});

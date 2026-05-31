import { describe, expect, it } from "vitest";
import { ALLOWED_PACKAGES, PINNED_VERSIONS } from "./index.js";

describe("shared-types", () => {
  it("has three pinned compiler versions", () => {
    expect(PINNED_VERSIONS).toHaveLength(3);
  });

  it("has allowlisted packages", () => {
    expect(ALLOWED_PACKAGES.length).toBeGreaterThan(0);
  });
});

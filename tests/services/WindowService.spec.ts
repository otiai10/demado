import { expect, test } from "vitest";
import WindowService from "../../src/services/WindowService";

test("WindowService", () => {
  expect(WindowService).toBeDefined();
  const wins = new WindowService();
  expect(wins).toBeDefined();
});

import { vi } from "vitest";

globalThis.chrome = {
  storage: {
    local: {},
  },
  runtime: {
    id: "demado_test_extension_id",
    getURL: (path: string) => path,
  },
  windows: {
    create: vi.fn(),
  },
  tabs: {
    zoom: {},
  },
} as unknown as typeof chrome;

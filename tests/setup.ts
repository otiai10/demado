/// <reference types="vitest/jsdom" />
import { vi } from "vitest";

// Node.js 26 の組み込みストレージではなく、ブラウザー環境のストレージを使う。
vi.stubGlobal("localStorage", jsdom.window.localStorage);

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

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useLoaderData: vi.fn(() => ({
      mados: [], config: {
        isAnnounceEffective: () => false,
      },
      exports: [],
    })),
    useNavigate: vi.fn(),
  }
});

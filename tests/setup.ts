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

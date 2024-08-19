import { describe, it, expect, vi, beforeEach } from 'vitest';
import MadoLauncher from '../../services/MadoLauncher';
import WindowService from '../../services/WindowService';
import TabService from '../../services/TabService';
import ScriptService from '../../services/ScriptService';
import Mado from '../../models/Mado';
import Dashboard from '../../models/Dashboard';

vi.mock('../../services/WindowService');
vi.mock('../../services/TabService');
vi.mock('../../services/ScriptService');
// vi.mock('../../models/Mado');
vi.mock('../../models/Dashboard');

describe('MadoLauncher', () => {
  let windowService: WindowService;
  let tabService: TabService;
  let scriptService: ScriptService;
  let madoLauncher: MadoLauncher;

  beforeEach(() => {
    windowService = new WindowService();
    tabService = new TabService();
    scriptService = new ScriptService();
    madoLauncher = new MadoLauncher(windowService, tabService, scriptService);
  });

  it('should open the dashboard if it is not already open', async () => {
    tabService.query = vi.fn().mockResolvedValue([]);
    windowService.create = vi.fn().mockResolvedValue({ id: 1 });
    Dashboard.user = vi.fn().mockResolvedValue({ toCreateData: () => ({}) });

    await madoLauncher.dashboard.open();

    expect(tabService.query).toHaveBeenCalledWith({ url: chrome.runtime.getURL('index.html') });
    expect(windowService.create).toHaveBeenCalledWith(chrome.runtime.getURL('index.html#dashboard'), {});
  });

  it('should focus the dashboard if it is already open', async () => {
    const tab = { id: 1, url: 'chrome-extension://id/index.html#dashboard', windowId: 1 };
    tabService.query = vi.fn().mockResolvedValue([tab]);
    windowService.focus = vi.fn().mockResolvedValue(undefined);

    await madoLauncher.dashboard.open();

    expect(tabService.query).toHaveBeenCalledWith({ url: chrome.runtime.getURL('index.html') });
    expect(windowService.focus).toHaveBeenCalledWith(tab.windowId);
  });

  it('should launch a Mado', async () => {
    const mado = Mado.new({ url: 'https://otiai10.com' });
    windowService.open = vi.fn().mockResolvedValue({ id: 1, tabs: [{ id: 123 }] });
    tabService.zoom = { set: vi.fn().mockResolvedValue(undefined) } as unknown as TabService['zoom'];
    scriptService.execute = vi.fn().mockResolvedValue({ outer: {}, inner: {} });
    const win = await madoLauncher.launch(mado);
    expect(windowService.open).toHaveBeenCalled();
    expect(tabService.zoom.set).toHaveBeenCalled();
    expect(scriptService.execute).toHaveBeenCalled();
    expect(win.id).toBe(1);
  });

  it('should check if a Mado exists', async () => {
    const mado = Mado.new({url: 'https://otiai10.com'});
    tabService.query = vi.fn().mockResolvedValue([{ id: 1, url: 'chrome-extension://id/index.html' }]);
    madoLauncher['identify'] = vi.fn().mockResolvedValue(true);
    const existance = await madoLauncher.retrieve(mado);
    expect(existance).not.toBeNull();
    expect(existance?.tab.id).toBe(1);
  });

  it('should mute a Mado', async () => {
    const mado = Mado.new({url: 'https://otiai10.com'});
    tabService.mute = vi.fn().mockResolvedValue(undefined);
    tabService.query = vi.fn().mockResolvedValue([{ id: 1, url: 'https://otiai10.com' }]);
    await madoLauncher.mute(mado, true);
    expect(tabService.mute).toHaveBeenCalled();
  });
});
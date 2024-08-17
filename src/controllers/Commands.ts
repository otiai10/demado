import { Router } from 'chromite';
import CaptureService from '../services/CaptureService';
import ScriptService from '../services/ScriptService';
import MadoLauncher from '../services/MadoLauncher';
import WindowService from '../services/WindowService';
import TabService from '../services/TabService';
import PermissionService from '../services/PermissionService';

const r = new Router<chrome.commands.CommandEvent>(async (command /* , tab */) => {
  return { __action__: command };
});

r.on('/screenshot', async (_cmd, tab) => {
  const launccher = new MadoLauncher(new WindowService(), new TabService(), new ScriptService());
  const mado = await launccher.lookup(tab.id!);
  if (!mado) return console.log("%c[WARN]", "color:yellow", "Mado not found for tab:", tab.id);
  const perm = new PermissionService();
  const yes = await perm.capture.granted();
  if (!yes) return console.log("%c[WARN]", "color:yellow", "Permission not granted for capture:", _cmd, tab.id);
  const capture = new CaptureService();
  capture.capture(mado);
});

r.onNotFound(async (command, tab) => {
  console.log("%c[WARN]", "color:yellow", "command not found", command, tab);
});

export default r;

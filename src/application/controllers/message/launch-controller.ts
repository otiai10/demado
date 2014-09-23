/// <reference path="../../controller.ts" />
/// <reference path="../../../infrastructure/launcher/launcher.ts" />

module DMD {
    export class LaunchController extends Controller {
        perform() {
            // TODO: resolve params from given message
            var game = GameFactory.createWithDefaultWidget("http://www.dmm.com/netgame/social/-/gadgets/=/app_id=137465/", "俺タワー");
            var params = game.toLaunchParams();
            Infra.Launcher.openPopup(params);
        }
    }
}
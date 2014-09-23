/// <reference path="../../controller.ts" />
/// <reference path="../../../infrastructure/launcher/launcher.ts" />

module DMD {
    export class LaunchController extends Controller {
        perform() {
            // TODO: resolve params from given message
            var params = {
                url: "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=137465/",
                width: 100,
                height: 100,
                left: 100,
                top: 100
            };
            Infra.Launcher.openPopup(params);
        }
    }
}
/// <reference path="../controller.ts" />
/// <reference path="../../../infrastructure/launcher/launcher.ts" />

module DMD {
    export class LaunchController extends Controller {
        perform(params: any): JQueryPromise {
            var d = $.Deferred();
            GameRepository.ofLocal().findById(params.id).done((game: Game) => {
                var params = game.toLaunchParams();
                Infra.Launcher.openPopup(params);
                // TODO: Launcher.openPopupがpromise返すべき
                d.resolve();
            }).fail((err) => {
                window.alert("Game not found for " + JSON.stringify(params));
                d.reject();
            });
            return d.promise();
        }
    }
}
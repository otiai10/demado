/// <reference path="../controller.ts" />
/// <reference path="../../../infrastructure/launcher/launcher.ts" />

module DMD {
    export class LaunchController extends Controller {
        perform(params: any) {
            GameRepository.ofLocal().findById(params.id).done((game: Game) => {
                var params = game.toLaunchParams();
                Infra.Launcher.openPopup(params);
            }).fail((err) => {
                window.alert("Game not found for " + JSON.stringify(params));
            });
        }
    }
}
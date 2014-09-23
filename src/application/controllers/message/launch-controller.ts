/// <reference path="../../controller.ts" />
/// <reference path="../../../infrastructure/launcher/launcher.ts" />

module DMD {
    export class LaunchController extends Controller {
        perform() {
            // TODO: resolve params from given message
            GameRepository.ofLocal().findById(137465).done((game: Game) => {
                var params = game.toLaunchParams();
                Infra.Launcher.openPopup(params);
            }).fail((err) => {
                window.alert("Game not found for id " + String(137465));
            });
        }
    }
}
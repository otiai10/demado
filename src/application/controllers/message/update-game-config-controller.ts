/// <reference path="../controller.ts" />

module DMD {
    export class UpdateGameConfigController extends Controller {
        perform(params: any): JQueryPromise {
            var d = $.Deferred();
            var id = params.id;
            DMD.GameRepository.ofLocal().findById(id).done((game: DMD.Game) => {
                game.options = params.options;
                game.widget.offset = params.offset;
                game.widget.size = params.size;
                DMD.GameRepository.ofLocal().save(game).done(() => {
                    d.resolve();
                }).fail((err) => {
                    d.reject(err);
                });
            }).fail((err) => {
                d.reject(err);
            });
            return d.promise();
        }
    }
}
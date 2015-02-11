/// <reference path="../controller.ts" />

module DMD {
    export class PositionTrackingController extends Controller {
        perform(params: any): JQueryPromise {
            var d = $.Deferred();
            var id = GameFactory.getIdFromUrl(params.url);
            // TODO: これ毎回インスタンスつくるんすか？
            var gameRepo = GameRepository.ofLocal();
            gameRepo.findById(id).done(game => {
                var position: Position = new Position(params.position.top, params.position.left);
                game.widget.position = position;
                gameRepo.save(game);
            });
            return d.promise();
        }
    }
}
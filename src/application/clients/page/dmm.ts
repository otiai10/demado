/// <reference path="../../../domain/game/game-factory.ts" />

module DMD {
    export class DMMPageClient extends PageClient {
        constructor() {
            super();
        }
        shift() {
            // TODO: このへんControllerにしたほうがよくね？
            GameFactory.resolveIdFromURL(location.href, "dmm").done((id: number) => {
                GameRepository.ofLocal().findById(id).done((game: Game) => {
                    this.shiftByOffset(game.widget.offset);
                });
            });
        }
    }
}
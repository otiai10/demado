/// <reference path="../../../domain/game/game-factory.ts" />

module DMD {
    export class DMMPageClient extends PageClient {
        constructor() {
            super("dmm");
        }
        shift(): JQueryPromise {
            var d = $.Deferred();
            this.resolveGameByURL().done((game: Game) => {
                this.shiftByOffset(game.widget.offset);
                d.resolve();
            }).fail(() => { d.reject(); });
            return d.promise();
        }
        sendPositionTracking() {
            chrome.runtime.sendMessage(null, {
                action: 'positionTracking',
                params:{
                    url: location.href,
                    position: {
                        left: window.screenLeft,
                        top: window.screenTop
                    }
                }
            });
        }
    }
}
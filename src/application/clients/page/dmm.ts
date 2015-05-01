/// <reference path="../../../domain/game/game-factory.ts" />

module DMD {
    export class DMMPageClient extends PageClient {
        constructor() {
            super("dmm");
        }
        shift(): JQueryPromise {
            var d = $.Deferred();
            ConfigRepository.ofLocal().get("temporary-disabled").done(disabled => {
                if (disabled.value) return d.resolve();
                this.resolveGameByURL().done((game: Game) => {
                    this.shiftByOffset(game.widget.offset, !game.options['visibleSettingEnabled']);
                d.resolve();
            }).fail(() => { d.reject(); });

            });

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
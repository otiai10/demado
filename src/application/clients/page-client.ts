
module DMD {
    export class PageClient {
        private visibleSettingPanelTpl = new HBSTemplate('client/visible-setting-panel');
        private currentSetting: any = {};
        constructor(public resolver:string) {
        }

        public resolveGameByURL():JQueryPromise<Game> {
            var d = $.Deferred();
            GameFactory.resolveIdFromURL(location.href, this.resolver).done((id:string) => {
                GameRepository.ofLocal().findById(id).done((game:Game) => {
                    if (game.options['visibleSettingEnabled']) {
                        this.enableVisibleSetting();
                    }
                    d.resolve(game);
                }).fail(() => {
                    d.reject();
                });
            }).fail(() => {
                d.reject();
            });
            return d.promise();
        }

        public shiftByOffset(offset:Offset) {
            setTimeout(() => {
                $('body').css({
                    //'transform':'scale(0.8)'
                    // 'position': 'fixed'
                });
                $('body').animate(this.convertOffsetToParams(offset), 500);
            }, 500);
        }
        private convertOffsetToParams(offset:Offset):Object { return { left: '-' + String(offset.left) + 'px', top: '-' + String(offset.top) + 'px' }; }  public adjust() {
            if (!Infra.OS.isWindows()) return;
            setTimeout(() => {
                this.resize();
            }, 300);
        }

        private resize() {
            var diffWidth = window.outerWidth - window.innerWidth;
            var diffHeight = window.outerHeight - window.innerHeight;
            window.resizeTo(window.outerWidth + diffWidth, window.outerHeight + diffHeight);
        }

        public listenOnBeforeUnload() {
            ConfigRepository.ofLocal().get('enable-confirm-on-close').done((config:DMD.Config) => {
                if (config && config.value == true) {
                    window.onbeforeunload = () => {
                        return document.title;
                    };
                }
            });
        }

        /**
         * enableVisibleSetting
         * ビジュアル設定UIを有効にするやつ
         * イベントバインディングもやる
         */
        private enableVisibleSetting() {
            /*
            var $panel = $(this.visibleSettingPanelTpl.render());
            $panel.find('#commin-current-setting').on('click', () => {
                window.alert("うゔぁー");
            });
            */
            var $panel = new DMD.VisibleSettingPanel();
            $('body').append($panel.render().$el);
        }
    }
}
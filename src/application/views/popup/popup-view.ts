/// <reference path="../../../definitions/showv.d.ts" />

module DMD {
    export class PopupView extends showv.View {
        private titleTpl = new HBSTemplate("popup/title");
        private stopTpl = new HBSTemplate("popup/stop");
        private disabled: boolean;
        events(): Object {
            return {
                "click #stop-temp": "stopTemporary",
                "click .game-item-list.to-launch": "launchGameWidget",
                "click .to-settings": "openSettingsPage"
            };
        }
        render(): PopupView {
            this.$el.append(
                this.titleTpl.render()
            );
            // FIXME: とりあえずfor appendでいいや
            GameRepository.ofLocal().findAll().done((games: Game[]) => {
                $.each(games, (key, game: Game) => {
                    var itemView = new PopupGameItemView(game);
                    this.$el.append(itemView.render().$el);
                });
                ConfigRepository.ofLocal().get('temporary-disabled').done((disabled) => {
                    this.disabled = disabled.value;
                    this.$el.append(this.stopTpl.render({
                        enabled: !disabled.value
                    }));
                    // update icon
                    var icon = chrome.extension.getURL("asset/img/icon/icon.19.png");
                    if (disabled.value) {
                        icon = chrome.extension.getURL("asset/img/icon/icon.sleep.png");
                    }
                    chrome.browserAction.setIcon({path: icon});
                });
            });
            return this;
        }
        launchGameWidget(ev: Event) {
            var target = $(ev.currentTarget);
            var params = {
                id: target.attr("data-gameid"),
                name: target.attr("data-gamename")
            };
            // TODO: なんかモジュールつくる？
            chrome.runtime.sendMessage(null,{action:'launch',params:params});
        }
        openSettingsPage() {
            chrome.runtime.sendMessage(null,{action:'open',params:{page:"settings"}});
        }
        stopTemporary() {
            chrome.runtime.sendMessage(null,{action:'toggleDisable',params:{}});
            // window.close();
            location.reload();
        }
    }
}
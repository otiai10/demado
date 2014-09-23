/// <reference path="../../../definitions/showv.d.ts" />

module DMD {
    export class PopupView extends showv.View {
        private titleTpl = new HBSTemplate("popup/title");
        events(): Object {
            return {
                "click .game-item-list.to-launch": "launchGameWidget"
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
    }
}
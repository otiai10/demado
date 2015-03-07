
module DMD {
    export class SettingsGamesView extends showv.View {
        private tpl = new HBSTemplate("settings/games");
        private addGameView = new AddGameView();
        events(): Object {
            return {
                "click .delete-game": "deleteGame",
                "click .edit-game": "editGame"
            };
        }
        render(): SettingsGamesView {
            this.$el.append(this.tpl.render());
            // FIXME: とりあえずいっか
            GameRepository.ofLocal().findAll().done((games: Game[]) => {
                $.each(games, (id, game: Game) => {
                    var item = new SettingsGameItemView(game);
                    this.$el.find('ul#settings-games').append(item.render().$el);
                });
                this.$el.find('ul#settings-games').append(this.addGameView.render().$el);
            });
            return this;
        }
        deleteGame(ev: Event) {
            var target = $(ev.target);
            var id: string = target.attr("data-gameid");
            var name = target.attr("data-gamename");
            this.confirmDelete(id, name).done(() => {
                GameRepository.ofLocal().deleteById(id).done(() => {
                    window.alert("削除しました");
                    // TODO: refresh
                    location.reload();
                }).fail(() => {
                    window.alert("削除しっぱい");
                });
            });
        }
        confirmDelete(id: string, name: string): JQueryPromise {
            var d = $.Deferred();
            if (window.confirm("以下の登録を削除します。よろしいですか？\n" + "id:" + id + "\nname:" + name)) {
                return d.resolve();
            }
            return d.reject();
        }
        editGame(ev: Event) {
            var target = $(ev.currentTarget);
            var id = target.attr("data-gameid");
            GameRepository.ofLocal().findById(id).done((game: Game) => {
                $("li#game-" + id).replaceWith(new AddGameView().renderWithGame(game).$el);
            });
        }
    }
}
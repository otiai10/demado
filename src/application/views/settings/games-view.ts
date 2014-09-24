
module DMD {
    export class SettingsGamesView extends showv.View {
        private tpl = new HBSTemplate("settings/games");
        private addGameView = new AddGameView();
        events(): Object {
            return {
                "click #add-game": "addGame"
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
    }
}
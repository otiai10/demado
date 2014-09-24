
module DMD {
    export class SettingsGameItemView extends showv.View {
        private tpl = new HBSTemplate("settings/game-item");
        constructor(private game: Game) {
            super();
        }
        render(): SettingsGameItemView {
            this.$el.append(this.tpl.render(this.game));
            return this;
        }
    }
}
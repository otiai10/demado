
module DMD {
    export class SettingsView extends showv.View {
        private gamesView = new SettingsGamesView();
        render(): SettingsView {
            this.$el.append(
                this.gamesView.render().$el
            );
            return this;
        }
    }
}

module DMD {
    export class SettingsView extends showv.View {
        private gamesView = new SettingsGamesView();
        private tipsView = new SettingsTipsView();
        render(): SettingsView {
            this.$el.append(
                this.gamesView.render().$el,
                this.tipsView.render().$el
            );
            return this;
        }
    }
}
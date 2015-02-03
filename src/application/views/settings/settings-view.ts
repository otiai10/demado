
module DMD {
    export class SettingsView extends showv.View {
        private gamesView = new SettingsGamesView();
        private configsView = new SettingsConfigsView();
        private tipsView = new SettingsTipsView();
        render(): SettingsView {
            this.$el.append(
                this.gamesView.render().$el,
                this.configsView.render().$el,
                this.tipsView.render().$el
            );
            return this;
        }
    }
}
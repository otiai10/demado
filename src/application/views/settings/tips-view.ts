
module DMD {
    export class SettingsTipsView extends showv.View {
        private tpl = new HBSTemplate("settings/tips");
        render(): SettingsTipsView {
            this.$el.append(this.tpl.render());
            return this;
        }
    }
}
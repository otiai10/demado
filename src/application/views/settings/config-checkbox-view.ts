
module DMD {
    export class ConfigCheckboxView extends showv.View {
        private tpl = new HBSTemplate("settings/config-checkbox");
        private repo = ConfigRepository.ofLocal();
        constructor(public config: Config) {
            super();
        }
        events(): Object {
            return {
                "click .config-checkbox": "toggleSetting"
            };
        }
        toggleSetting(ev: Event) {
            this.config.value = ev.target['checked'];
            this.repo.save(this.config).fail((err) => {
                console.log(err);
            });
        }
        render(): ConfigCheckboxView {
            this.$el.append(this.tpl.render(this.config));
            return this;
        }
    }
}
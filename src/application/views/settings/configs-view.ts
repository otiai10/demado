
module DMD {
    export class SettingsConfigsView extends showv.View {
        private tpl = new HBSTemplate("settings/configs");
        render(): SettingsConfigsView {
            this.$el.append(this.tpl.render());
            // FIXME: とりあえずいっか
            ConfigRepository.ofLocal().findAll().done((configs: Config[]) => {
                $.each(configs, (id, config: Config) => {
                    var item = this.dispatchView(config);
                    this.$el.find('ul#settings-configs').append(item.render().$el);
                });
            });
            return this;
        }
        dispatchView(config: Config): showv.View {
            switch (config.type) {
                case ConfigType.Checkbox:
                    return new ConfigCheckboxView(config);
            }
        }
    }
}
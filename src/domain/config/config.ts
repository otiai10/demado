

module DMD {
    export enum ConfigType {
        Checkbox,
        Text,
        RadioButton,
        FileSelect,
    }
    export class Config {
        constructor(public type: ConfigType,
                    public key: string,
                    public name: string,
                    public value: any) {}
    }
    export class ConfigFactory {
        public static createFromStored(storedObject: Object): Config {
            return new Config(
                storedObject['type'],
                storedObject['key'],
                storedObject['name'],
                storedObject['value']
            )
        }
    }
    export class ConfigRepository {
        constructor(private storage: Infra.ChromeStorage) {}
        public static ofLocal(): ConfigRepository {
            return new this(Infra.ChromeStorage.ofLocal());
        }
        public findAll(): JQueryPromise<Config[]> {
            var d = $.Deferred();
            this.storage.get("configs").done((configs: Object) => {
                var res: Config[] = [];
                $.each(configs, (key, storedObject) => {
                    res.push(ConfigFactory.createFromStored(storedObject));
                });
                d.resolve(res);
            }).fail((err) => {
                // d.resolve([]);
                d.resolve(defaultConfigs);
            });
            return d.promise();
        }
        public save(config: Config): JQueryPromise {
            var d = $.Deferred();
            // TODO: DRY
            this.storage.get("configs").done((configs: Object) => {
                configs[config.key] = config;
                this.storage.set("configs", configs).done(() => {
                    d.resolve();
                }).fail(() => { d.reject(); });
            }).fail((err) => {
                var configs = defaultConfigs;
                configs[config.key] = config;
                this.storage.set("configs", configs).done(() => {
                    d.resolve();
                }).fail(() => { d.reject(); });
            });
            return d.promise();
        }

        /**
         * なかったらundefinedかえすことにした
         * @param key
         * @returns {JQueryPromise<T>}
         */
        public get(key: string): JQueryPromise<Config> {
            var d = $.Deferred();
            this.storage.get("configs").done((configs: Object) => {
                d.resolve(configs[key]);
            }).fail((err) => {
                // d.resolve([]);
                d.resolve(defaultConfigs[key]);
            });
            return d.promise();
        }
    }
    var defaultConfigs = {
        'enable-confirm-on-close': {
            type: ConfigType.Checkbox,
            key: 'enable-confirm-on-close',
            name: '閉じるボタンを押したとき確認を出す',
            value: false
        }
    }
}
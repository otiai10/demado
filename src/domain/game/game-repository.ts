
module DMD {
    export class GameRepository {
        constructor(private storage: Infra.ChromeStorage) {}
        public static ofLocal(): GameRepository {
            return new this(Infra.ChromeStorage.ofLocal());
        }
        public findById(id: number): JQueryPromise<Game> {
            var d = $.Deferred();
            this.storage.get("games").done((games: Object) => {
                if (games[id]) d.resolve(GameFactory.createFromStored(games[id]));
                else d.reject();
            }).fail((err) => {
                d.reject();
            });
            return d.promise();
        }
        public findAll(): JQueryPromise<Game[]> {
            var d = $.Deferred();
            this.storage.get("games").done((games: Object) => {
                var res: Game[] = [];
                $.each(games, (key, storedObject) => {
                    res.push(GameFactory.createFromStored(storedObject));
                });
                d.resolve(res);
            }).fail((err) => {
                d.resolve([]);
            });
            return d.promise();
        }
        public save(game: Game): JQueryPromise {
            var d = $.Deferred();
            // TODO: DRY
            this.storage.get("games").done((games: Object) => {
                games[game.id] = game;
                this.storage.set("games", games).done(() => {
                    d.resolve();
                }).fail(() => { d.reject(); });
            }).fail((err) => {
                var games = {};
                games[game.id] = game;
                this.storage.set("games", games).done(() => {
                    d.resolve();
                }).fail(() => { d.reject(); });
            });
            return d.promise();
        }
        public delete(game: Game): JQueryPromise {
            return this.deleteById(game.id);
        }
        public deleteById(id: number): JQueryPromise {
            var d = $.Deferred();
            this.storage.get("games").done((games: Object) => {
                delete games[id];
                this.storage.set("games", games).done(() => {
                   d.resolve();
                }).fail(() => { d.reject(); });
            }).fail(() => {
                d.reject();
            });
            return d.promise();
        }
    }
}
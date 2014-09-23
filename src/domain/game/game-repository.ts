
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
        public save(game: Game) {
            // TODO: DRY
            this.storage.get("games").done((games: Object) => {
                games[game.id] = game;
                this.storage.set("games", games);
            }).fail((err) => {
                var games = {};
                games[game.id] = game;
                this.storage.set("games", games);
            });
        }
    }
}
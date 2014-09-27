/// <reference path="./game.ts" />

module DMD {
    export class GameFactory {
        public static expressions: Object = {
            dmm: /^http:\/\/www\.dmm\.(com|co\.jp)\/netgame\/social\/-\/gadgets\/=\/app_id=([0-9]+)/;
        };
        public static createWithDefaultWidget(url: string, name: string): Game {
            var id: number = GameFactory.getIdFromUrl(url);
            return new Game(id, name, url, WidgetFactory.createDefault());
        }
        public static createFromStored(stored: Object): Game {
            return new Game(
                stored["id"],
                stored["name"],
                stored["url"],
                new Widget(
                    new Size(
                        stored["widget"]["size"]["width"],
                        stored["widget"]["size"]["height"]
                    ),
                    new Offset(
                        stored["widget"]["offset"]["top"],
                        stored["widget"]["offset"]["left"]
                    )
                )
            );
        }
        public static createFromInputs(url: string, name: string, width: number, height: number, left: number, top: number): JQueryPromise<Game> {
            var d = $.Deferred();
            d.resolve(new Game(
                GameFactory.getIdFromUrl(url),
                name,
                url,
                new Widget(
                    new Size(width || 100, height || 100),
                    new Offset(top || 10, left || 10)
                )
            ));
            return d.promise();
        }
        private static getIdFromUrl(url: string): number {
            var matches = url.match(GameFactory.expressions["dmm"]);
            if (matches == null || matches.length < 3) throw Error("app_idを特定できません");
            return parseInt(matches[2]);
        }
        public static decodeToLaunchParams(game: Game): LaunchParams {
            return {
                url: game.url,
                width: game.widget.size.width,
                height: game.widget.size.height,
                top: game.widget.offset.top,
                left: game.widget.offset.left
            };
        }
        public static resolveIdFromURL(url: string, resolver: string): JQueryPromise {
            var d = $.Deferred();
            var matches = url.match(GameFactory.expressions[resolver]);
            if (matches == null || matches.length < 3) return d.reject();
            return d.resolve(parseInt(matches[2]));
        }
    }
}

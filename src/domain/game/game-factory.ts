/// <reference path="./game.ts" />

module DMD {
    // とりあえず
    export var tmpStorage:any = {};// id:optionのオンメモリストレージ
    export class GameFactory {
        public static expressions: Object = {
            dmm: /^http:\/\/www\.dmm\.(com|co\.jp)\/netgame\/social\/-\/gadgets\/=\/app_id=([0-9]+)/,
            yahoomobage: /^http:\/\/yahoo-mbga\.(jp)\/game\/([0-9]+)\/(play)?/
        };
        public static createWithDefaultWidget(url: string, name: string): Game {
            var id: string = GameFactory.getIdFromUrl(url);
            return new Game(id, name, url, WidgetFactory.createDefault());
        }
        public static createFromStored(stored: Object): Game {
            // optionだけはとりあえずオンメモリからとるようにします
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
                    ),
                    new Position(
                        stored["widget"]["position"] ? stored["widget"]["position"]["top"] : 75,
                        stored["widget"]["position"] ? stored["widget"]["position"]["left"] : 70
                    )
                ),
                stored["options"] || {}
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
                    new Offset(top, left),
                    new Position(top, left)// でフォルトではOffset値と一緒にする
                )
            ));
            return d.promise();
        }

        /**
         * うーん、これpublic staticでいいのかな。dmmって書いてあるし
         * @param url
         * @returns {number}
         */
        public static getIdFromUrl(url: string): string {
            var resolver = "";
            var matches = url.match(GameFactory.expressions["dmm"]);
            if (matches && matches.length > 2) return resolver + parseInt(matches[2]);
            resolver = "yahoomobage";
            var matches = url.match(GameFactory.expressions[resolver]);
            if (matches && matches.length > 2) return resolver + parseInt(matches[2]);
            throw Error("app_idを特定できません");
        }
        public static decodeToLaunchParams(game: Game): LaunchParams {
            return {
                url: game.url,
                width: game.widget.size.width,
                height: game.widget.size.height,
                top: game.widget.position.top,
                left: game.widget.position.left
            };
        }
        public static resolveIdFromURL(url: string, resolver: string): JQueryPromise {
            var d = $.Deferred();
            var matches = url.match(GameFactory.expressions[resolver]);
            if (matches == null || matches.length < 3) return d.reject();
            if (resolver == 'dmm') resolver = '';// 後方互換
            return d.resolve(resolver + (matches[2]));
        }
    }
}

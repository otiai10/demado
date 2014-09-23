/// <reference path="./game.ts" />

module DMD {
    export class GameFactory {
        private static expressions: Object = {
            dmm: /^http:\/\/www\.dmm\.com\/netgame\/social\/-\/gadgets\/=\/app_id=([0-9]+)/
        };
        public static createWithDefaultWidget(url: string, name: string): Game {
            var id: number = GameFactory.getIdFromUrl(url);
            return new Game(id, name, url, WidgetFactory.createDefault());
        }
        private static getIdFromUrl(url: string): number {
            var matches = url.match(GameFactory.expressions["dmm"]);
            if (matches == null || matches.length < 2) throw Error("app_idを特定できません");
            return parseInt(matches[1]);
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
    }
}
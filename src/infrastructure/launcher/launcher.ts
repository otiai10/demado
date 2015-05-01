/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/chrome.d.ts" />

module Infra {
    export interface OpenParams {
        url: string;
        width?: number;
        height?: number;
        left?: number;
        top?: number;
        type?: string;
    }
    export class Launcher {
        private static open(params: OpenParams): JQueryPromise {
            delete(params["options"]);// optionsはchromeモジュールレベルでいらない
            var d = $.Deferred();
            chrome.windows.create(params, (win: any) => {
                d.resolve(win);
            });
            return d.promise();
        }
        public static openPopup(params: OpenParams) {
            Launcher.findExists(params).fail(() => {
                Launcher.open($.extend({}, params, {type: "popup"})).done((win: any) => {
                    console.log("opened", win);
                });
            }).done((tab: chrome.tabs.Tab) => {
                console.log("already exists", tab);
                // chrome.windows.updateがouterWidthを要求してて非常につらい感じ
                var area: any = Launcher.frameArea();
                chrome.windows.update(tab.windowId, {
                    width: params.width + area.width,
                    height: params.height + area.height
                })
            });
        }
        public static openByPageName(page: string) {
            var url = chrome.extension.getURL("asset/html/" + page + ".html");
            chrome.tabs.create({
                url: url
            });
        }
        public static findExists(params: OpenParams): JQueryPromise {
            var d = $.Deferred();
            chrome.tabs.query({url: params.url}, (tabs: chrome.tabs.Tab[]) => {
                if (!tabs || !tabs.length) return d.reject();
                return d.resolve(tabs[0]);
            });
            return d.promise();
        }
        private static frameArea(): any {
            var mac = {
                height: 22,
                width: 0
            };
            // FIXME: あ〜こころがぴょんぴょんするんじゃ〜
            // FIXME: 誰かーたのむー
            var win = {
                height: 30,
                width: 8
            };
            return OS.isWindows() ? win : mac;
        }
    }
}
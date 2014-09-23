/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/chrome.d.ts" />

module Infra {
    export interface OpenParams {
        url: string;
        width: number;
        height: number;
        left: number;
        top: number;
        type?: string;
    }
    export class Launcher {
        private static open(params: OpenParams): JQueryPromise {
            var d = $.Deferred();
            chrome.windows.create(params, (win: any) => {
                d.resolve(win);
            });
            return d.promise();
        }
        public static openPopup(params: OpenParams) {
            Launcher.open($.extend({}, params, {type: "popup"})).done((win: any) => {
                console.log("opened", win);
            });
        }
    }
}
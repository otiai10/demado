/// <reference path="../../../definitions/jquery.d.ts" />
/// <reference path="../../../definitions/chrome.d.ts" />

module Infra {
    export class ChromeStorage {
        public static ofLocal(): ChromeStorageLocal {
            return new ChromeStorageLocal();
        }
        public static ofSync(): ChromeStorageSync {
            return new ChromeStorageSync();
        }
        public static ofTest(): ChromeStorageLocal {
            return new ChromeStorageLocal("test");
        }
        constructor(private area: chrome.storage.StorageArea) {}
        get(key: string): JQueryPromise {
            var d = $.Deferred();
            this.area.get(key, (items: Object) => {
                if (items[key]) d.resolve(items[key]);
                else d.reject({});
            });
            return d.promise();
        }
        set(key: string, val: any): JQueryPromise {
            var d = $.Deferred();
            var obj = {};
            obj[key] = val;
            this.area.set(obj, () => {
                d.resolve(true);
            });
            return d.promise();
        }
    }
    export class ChromeStorageLocal extends ChromeStorage {
        constructor(private prefix: string = "") {
            super(chrome.storage.local);
        }
    }
    export class ChromeStorageSync extends ChromeStorage {
        constructor(private prefix: string = "") {
            super(chrome.storage.sync);
        }
    }
}

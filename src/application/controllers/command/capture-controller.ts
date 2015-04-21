/// <reference path="../controller.ts" />

module DMD {
    export class CaptureController extends Controller {
        private priscExtId = "gghkamaeinhfnhpempdbopannocnlbkg";
        // private priscExtId = "hkmlffmijpfeojgjldohekecfiendhbe";
        perform(): JQueryPromise {
            var d = $.Deferred();
            var fired = false, ended = false;
            chrome.tabs.captureVisibleTab({format:'png'}, (res) => {
                this.message(res, (message: Object) => {
                    chrome.runtime.sendMessage(this.priscExtId, message,(res) => {
                        // TODO: response validation? and d.reject?
                        if (ended) return;
                        fired = true;
                        d.resolve();
                    });
                    setTimeout(() => {
                        if (! fired) {
                            ended = true;
                            d.reject("messaging timeout");
                        }
                    }, 1000);
                });
            });
            return d.promise();
        }
        private message(imageURI: string, callback: (Object) => void) {
            ConfigRepository.ofLocal().get('prisc-direct-download').done(config => {
                var message = {};
                if (config.value) {
                    var ext = imageURI.match(/^data:image\/([a-z]+);/)[1].replace('e','');
                    var filename = "demado_" + String(Date.now()) + "." + ext;
                    message = {path: "download/image", params: {imageURI:imageURI, filename:filename}};
                } else {
                    // ここ、フィールド名注意な
                    message = {path: "open/edit",params: {imgURI:imageURI}};
                }
                callback(message);
            });

        }
    }
}

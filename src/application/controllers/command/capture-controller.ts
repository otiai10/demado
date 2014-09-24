/// <reference path="../controller.ts" />

module DMD {
    export class CaptureController extends Controller {
        private priscExtId = "gghkamaeinhfnhpempdbopannocnlbkg";
        perform(): JQueryPromise {
            var d = $.Deferred();
            var fired = false, ended = false;
            chrome.tabs.captureVisibleTab(null, (res) => {
                var message = {path: "open/edit",params: {imgURI:res}};
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
            return d.promise();
        }
    }
}

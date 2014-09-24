/// <reference path="../../definitions/jquery.d.ts" />
module DMD {
    export class Controller {
        execute(params: any = {}): JQueryPromise {
            // TODO: かっこわるい
            var d = $.Deferred();
            this.before().done(() => {
                this.perform(params).done(() => {
                    this.after().done(() => {
                       d.resolve();
                    }).fail(() => { d.reject(); });
                }).fail(() => { d.reject(); });
            }).fail(() => { d.reject(); });
            return d.promise();
        }
        before(): JQueryPromise {
            return $.Deferred().resolve();
        }
        perform(params: any): JQueryPromise {
            return $.Deferred().resolve();
        }
        after(): JQueryPromise {
            return $.Deferred().resolve();
        }
    }
}
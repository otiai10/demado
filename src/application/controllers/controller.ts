/// <reference path="../../definitions/jquery.d.ts" />
module DMD {
    export class Controller {
        execute(params: any): JQueryPromise {
            var d = $.Deferred();
            this.before();
            this.perform(params);
            this.after();
            return d.promise();
        }
        before() {}
        perform(params: any) {}
        after() {}
    }
}
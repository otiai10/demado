/// <reference path="../definitions/jquery.d.ts" />
module DMD {
    export class Controller {
        execute(): JQueryPromise {
            var d = $.Deferred();
            this.before();
            this.perform();
            this.after();
            return d.promise();
        }
        before() {}
        perform() {}
        after() {}
    }
}
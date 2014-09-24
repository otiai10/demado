/// <reference path="../controller.ts" />

module DMD {
    export class OpenPageController extends Controller {
        perform(params: any): JQueryPromise {
            var d = $.Deferred();
            Infra.Launcher.openByPageName(params.page);
            // TODO: Launcher.openByPageNameがpromise返すべき
            return d.resolve();
        }
    }
}
/// <reference path="../controller.ts" />

module DMD {
    export class OpenPageController extends Controller {
        perform(params: any) {
            Infra.Launcher.openByPageName(params.page);
        }
    }
}
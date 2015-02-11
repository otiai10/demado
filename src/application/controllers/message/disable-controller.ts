/// <reference path="../controller.ts" />

module DMD {
    export class ToggleDisableController extends Controller {
        perform(params: any): JQueryPromise {
            var d = $.Deferred();
            ConfigRepository.ofLocal().get('temporary-disabled').done(config => {
                config.value = !config.value;
                ConfigRepository.ofLocal().save(config);
            });
            return d.promise();
        }
    }
}
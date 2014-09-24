/// <reference path="../definitions/chrome.d.ts" />
/// <reference path="./controllers/controller.ts" />

module DMD {
    export interface DMDMessageInterface {
        action: string;
        params: any;
    }
    export class Router {
        private routes = {
            'launch': LaunchController,
            'open': OpenPageController
        };
        constructor() {}
        listen() {
            chrome.runtime.onMessage.addListener((message: DMDMessageInterface, sender: any, respond: (any) => any) => {
                this.resolve(message).execute(message.params);
            });
        }
        resolve(message: DMDMessageInterface): Controller {
            // TODO: とりあえず
            if (this.routes[message.action]) return new this.routes[message.action]();
            return new LaunchController();
        }
    }
}
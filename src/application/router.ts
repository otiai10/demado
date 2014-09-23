/// <reference path="../definitions/chrome.d.ts" />
/// <reference path="./controller.ts" />

module DMD {
    export interface DMDMessageInterface {
        action: string;
    }
    export class Router {
        constructor() {}
        listen() {
            chrome.runtime.onMessage.addListener((message: DMDMessageInterface, sender: any, respond: (any) => any) => {
                this.resolve(message).execute();
            });
        }
        resolve(message: DMDMessageInterface): Controller {
            // TODO: とりあえず
            return new LaunchController();
        }
    }
}
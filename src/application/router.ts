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
            'open': OpenPageController,
            'capture': CaptureController,
            'positionTracking': PositionTrackingController,
            'setOption': UpdateGameConfigController,
            'toggleDisable': ToggleDisableController
        };
        constructor() {}
        listen() {
            chrome.runtime.onMessage.addListener((message: DMDMessageInterface, sender: any, respond: (any) => any) => {
                this.resolve(message.action).execute(message.params);
            });
            chrome.commands.onCommand.addListener((command: string) => {
                this.resolve(command).execute();
            });
        }
        resolve(action: string): Controller {
            // TODO: とりあえず
            if (this.routes[action]) return new this.routes[action]();
            return new LaunchController();
        }
    }
}

module DMD {
    export interface LaunchParams {
        url: string;
        width: number;
        height: number;
        left: number;
        top: number;
    }
    export class Game {
        constructor(public id: string,
                    public name: string,
                    public url: string,
                    public widget: Widget,
                    public options: any = {}) {}
        toLaunchParams(): LaunchParams {
            return GameFactory.decodeToLaunchParams(this);
        }
    }
}

module Infra.OS {
    export function isWindows(): boolean {
        return (window.navigator.userAgent.match(/Win/) || window.navigator.platform.indexOf('Win') !== -1);
    }
}
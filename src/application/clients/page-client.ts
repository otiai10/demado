
module DMD {
    export class PageClient {
        // TODO: たぶんこのへん基底クラスにもってく
        public shiftByOffset(offset:Offset) {
            setTimeout(() => {
                $('body').css({
                    //'transform':'scale(0.8)'
                    'position': 'fixed'
                });
                $('body').animate(this.convertOffsetToParams(offset), 500);
            }, 500);
        }
        private convertOffsetToParams(offset:Offset):Object {
            return {
                left: '-' + String(offset.left) + 'px',
                top: '-' + String(offset.top) + 'px'
            };
        }
        public adjust() {
            if (! Infra.OS.isWindows()) return;
            setTimeout(() => {
                this.resize();
            }, 300);
        }
        private resize() {
            var diffWidth = window.outerWidth - window.innerWidth;
            var diffHeight = window.outerHeight - window.innerHeight;
            window.resizeTo(window.outerWidth + diffWidth, window.outerHeight + diffHeight);
        }
    }
}
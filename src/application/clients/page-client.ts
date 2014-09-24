
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
    }
}
/// <reference path="../../../definitions/showv.d.ts" />

module DMD {
    export class PopupView extends showv.View {
        private tpl = new HBSTemplate("popup/title");
        render(): PopupView {
            this.$el.append(
                this.tpl.render()
            );
            return this;
        }
    }
}
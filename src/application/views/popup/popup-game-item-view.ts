
module DMD {
    export class PopupGameItemView extends showv.View {
        private tpl = new HBSTemplate("popup/game-item");
        constructor(private game: Game) {
            super();
        }
        render(): PopupGameItemView {
            this.$el.append(this.tpl.render(this.game));
            return this;
        }
    }
}
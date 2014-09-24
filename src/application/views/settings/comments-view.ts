
module DMD {
    export class CommentsView extends showv.View {
        private tpl = new HBSTemplate("settings/comments");
        render(): CommentsView {
            this.$el.append(this.tpl.render({
                comment:"デザインは今後暇になったらちゃんとします"
            }));
            return this;
        }
    }
}
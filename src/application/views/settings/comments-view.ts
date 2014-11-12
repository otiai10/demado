
module DMD {
    export class CommentsView extends showv.View {
        private tpl = new HBSTemplate("settings/comments");
        render(): CommentsView {
            this.$el.append(this.tpl.render({
                comments:[
                    '<a href="https://chrome.google.com/webstore/detail/prisc/gghkamaeinhfnhpempdbopannocnlbkg?hl=ja">Prisc</a>入れてたら普通にスクショ撮れます',
                    'Chrome拡張設定画面(chrome://extensions)行って、いちばん下の「キーボードショートカット」を登録すればいけると思います'
                ]
            }));
            return this;
        }
    }
}
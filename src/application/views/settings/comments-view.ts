
module DMD {
    export class CommentsView extends showv.View {
        private tpl = new HBSTemplate("settings/comments");
        render(): CommentsView {
            this.$el.append(this.tpl.render({
                comments:[
                    '<a href="https://chrome.google.com/webstore/detail/prisc/gghkamaeinhfnhpempdbopannocnlbkg?hl=ja">Prisc</a>入れてたら普通にスクショ撮れます',
                    'Chrome拡張設定画面(chrome://extensions)行って、いちばん下の「キーボードショートカット」を登録すればいけると思います',
                    '[v0.1.10] 誤ってウィンドウ閉じるボタン押しちゃうときに対応しました',
                    '[v0.1.11] 誤ってウィンドウ閉じるボタン押しちゃうときに対応を、せっていでon/off可能にしました'
                ]
            }));
            return this;
        }
    }
}

module DMD {
    export class CommentsView extends showv.View {
        private tpl = new HBSTemplate("settings/comments");
        render(): CommentsView {
            this.$el.append(this.tpl.render({
                comments:[
                    '<a href="https://chrome.google.com/webstore/detail/prisc/gghkamaeinhfnhpempdbopannocnlbkg?hl=ja">Prisc</a>入れてたら普通にスクショ撮れます',
                    'Chrome拡張設定画面(chrome://extensions)行って、いちばん下の「キーボードショートカット」を登録すればいけると思います',
                    '[v0.1.10] 誤ってウィンドウ閉じるボタン押しちゃうときに対応しました',
                    '[v0.1.11] 誤ってウィンドウ閉じるボタン押しちゃうときに対応を、せっていでon/off可能にしました',
                    '[v0.1.12] 最後に開いたウィンドウ位置の記憶機能を追加しました',
                    '[v0.1.20] 一時的に無効化する機能を追加しました',
                    '[v0.1.30] YahooMobageのゲームに対応しました',
                    '[v0.1.40] Prisc!連携で編集経由せずにダウンロードする設定を追加',
                    '[v0.1.50] ビジュアル微調整モードを追加',
                    '[v0.1.55] もっかい開こうとしたらサイズ修正する機能を追加',
                    '[v0.1.60] 登録してないURLでも閉じる確認ダイアログがでちゃうバグを修正',
                    '[v0.1.60] 「入力が不正です」という不親切なエラーメッセージを改善'
                ]
            }));
            return this;
        }
    }
}

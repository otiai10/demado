import { Model, Types } from "jstorm/chrome/local";
import Mado from "./Mado";
import { LaunchMode } from "../services/MadoLauncher"; // いやーこれ循環参照きもちわるいな

/**
 * LaunchHistory
 *
 * ログイン画面を挟んでリダイレクトされると、どうしてもdemadoとして開いた目印である
 * sessionStorageが消えてしまうので、その情報を一次的にだけ保持するためのモデル
 * Usage側でhisotry.delete()を呼ぶことで、その情報を消すようにすべきだが
 * どこかで自動でLaunchHistory.drop()を呼ぶようにしてもいいかもしれない
 */
export default class LaunchHistory extends Model {
  static override _namespace_ = "LaunchHistory";
  static override schema = {
    mado: Types.model(Mado),
    mode: Types.string,
  }
  public mado: Mado = Mado.new();
  public mode: LaunchMode = LaunchMode.DEFAULT;

  public static async draw(tabId: number): Promise<LaunchHistory | null> {
    const history = await this.find(`${tabId}`);
    if (history) history.delete();
    return history;
  }
}

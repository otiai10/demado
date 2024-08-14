import { Model, Types } from 'jstorm/chrome/local';
import { Schema } from 'jstorm/model';

interface MadoExistanceChecker {
  exists(mado: Mado): Promise<{ win: chrome.windows.Window, tab: chrome.tabs.Tab, mado: Mado } | null>;
}

const defaultColorSet = [
  '#00D1B2',
  '#4258FF',
  '#66D1FF',
  '#FFB70F',
  '#FF6685',
  // '#2B2D42',
  // '#E86A92',
  // '#F7E733',
  // '#F7F7F9',
  // '#41E2BA',
];

export default class Mado extends Model {
  static override _namespace_ = 'Mado';
  static override _nextID_ = () => Math.random().toString(36).slice(2);

  static override schema: Schema = {
    name: Types.string.isRequired,
    // description: Types.string,

    /**
     * @LAUNCH-PROPERTIES
     * `chrome.windows.create` でウィンドウを作るときにに渡すオプション
     **/
    // ウェブページURL
    url: Types.string.isRequired,
    // 窓サイズ
    size: Types.shape({
      width:  Types.number.isRequired,
      height: Types.number.isRequired,
    }).isRequired,
    // ディスプレイに対するLaunchPosition
    position: Types.shape({
      x: Types.number.isRequired,
      y: Types.number.isRequired,
    }).isRequired,
    // アドレスバー表示
    addressbar: Types.bool,

    /**
     * @MODIFY-PROPERTIES
     * `chrome.tabs.update` や、
     * `chrome.tabs.executeScript` など、
     * タブを操作するときに渡すオプション
     **/
    // ズーム倍率
    zoom: Types.number.isRequired,
    // 窓コンテンツのずれ
    offset: Types.shape({
      left: Types.number.isRequired,
      top:  Types.number.isRequired,
    }),
    // 高度なDOM操作
    advanced: Types.shape({
      remove: Types.arrayOf(Types.string),
    }),

    /**
     * @UI-PROPERTIES
     * ユーザーインターフェースの設定
     */
    index: Types.number,
    colorcode: Types.string,
  }

  public name: string = "";
  // public descrption: string = "";
  // public url: string = "https://www.youtube.com/embed/243vPl8HdVk?si=Q6klBm7LRVqR196I";
  public url: string = "";
  public size = { width: 1200, height: 720 };
  public position = { x: 0, y: 0 };
  public addressbar: boolean = false;

  public zoom: number = 1.0;
  public offset = { left: 0, top: 0 };
  public advanced = { remove: [] };

  public index: number = 0;
  public colorcode: string = "";

  // すでに窓がChromeウィンドウ的な文脈で存在するのか、check()によって確認された結果
  public $existance: { win: chrome.windows.Window, tab: chrome.tabs.Tab } | null = null;

  private static colorcodeByIndex(index: number): string {
    return defaultColorSet[index % defaultColorSet.length];
  }

  public colorcodeByIndex(index: number): string {
    return this.colorcode || Mado.colorcodeByIndex(index);
  }

  public hasValidURL(): boolean {
    try {
      new URL(this.url);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async check(checker: MadoExistanceChecker): Promise<Mado> {
    const result = await checker.exists(this);
    this.$existance = result;
    return this;
  }
}
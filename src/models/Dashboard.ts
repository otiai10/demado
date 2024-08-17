import { Model, Types } from "jstorm/chrome/local";

export default class Dashboard extends Model {
  static override _namespace_ = 'Dashboard';

  public size: { width: number, height: number } = { width: 300, height: 240 };
  public position: { x: number, y: number } = { x: 0, y: 0 };

  static override schema = {
    size: Types.shape({
      width:  Types.number.isRequired,
      height: Types.number.isRequired,
    }).isRequired,
    position: Types.shape({
      x: Types.number.isRequired,
      y: Types.number.isRequired,
    }).isRequired,
  }

  static async user(): Promise<Dashboard> {
    const global_id = "__user__";
    const user = await this.find(global_id);
    if (user) return user;
    return await this.create({ _id: global_id });
  }

  static async track(windowlike: {
    screenX: number,
    screenY: number,
    outerWidth: number,
    outerHeight: number
  }): Promise<Dashboard> {
    const dashboard = await this.user();
    dashboard.position = { x: windowlike.screenX, y: windowlike.screenY };
    // XXX: outerでいいのか？
    dashboard.size = { width: windowlike.outerWidth, height: windowlike.outerHeight };
    return dashboard.save();
  }

  toCreateData(): chrome.windows.CreateData {
    return {
      type: "popup",
      width: this.size.width,
      height: this.size.height,
      left: this.position.x,
      top: this.position.y,
    };
  }
}
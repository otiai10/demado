import { Model } from "jstorm/chrome/local";

export default class GlobalConfig extends Model {
  public static override _namespace_?: string | undefined = "GlobalConfig";

  public alertOnClose: boolean = false;

  static async user(): Promise<GlobalConfig> {
    const global_id = "__user__";
    const user = await this.find(global_id);
    if (user) return user;
    return await this.create({ _id: global_id });
  }
}
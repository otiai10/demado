import { Model } from "jstorm/chrome/local";

export default class GlobalConfig extends Model {
  public static override _namespace_?: string | undefined = "GlobalConfig";

  public alertOnClose: boolean = false;
  public readDevInfoVersion: string = "v0.0.0";

  static async user(): Promise<GlobalConfig> {
    const global_id = "__user__";
    const user = await this.find(global_id);
    if (user) return user;
    return await this.create({ _id: global_id });
  }

  hasReadDevInfo(version: string): boolean {
    const already = GlobalConfig.parseVersion(this.readDevInfoVersion);
    const target = GlobalConfig.parseVersion(version);
    if (already.major > target.major) return true;
    if (already.major < target.major) return false;
    if (already.minor > target.minor) return true;
    if (already.minor < target.minor) return false;
    return already.patch >= target.patch;
  }
  private static parseVersion(version: string): { major: number, minor: number, patch: number } {
    const [major, minor, patch] = version.replace(/^v/, "").split(".").map(v => parseInt(v));
    return { major, minor, patch };
  }
}

export default class PermissionService {
  constructor(
    private readonly mod: typeof chrome.permissions = chrome.permissions,
  ) { }

  private async contains(url: string): Promise<chrome.permissions.Permissions | null> {
    const urlObj = new URL(url);
    const perm = {
      origins: [urlObj.origin + "/*"],
      permissions: ["activeTab", "scripting", "tabs"],
    };
    try {
      const yes = await this.mod.contains(perm);
      return yes ? perm : null;
    } catch (e) {
      // console.log("[ERROR] PermissionService.contains", e);
      return null;
    }
  }

  public capture = {
    grant: () => this.mod.request({ permissions: ["activeTab"], origins: ["<all_urls>"] }),
    granted: () => this.mod.contains({ permissions: ["activeTab"], origins: ["<all_urls>"] }),
  }

  private async request(url: string): Promise<chrome.permissions.Permissions | null> {
    const urlObj = new URL(url);
    const perm = { origins: [urlObj.origin + "/*"] };
    const yes = await this.mod.request(perm);
    return yes ? perm : null;
  }

  // remove(url: string): Promise<boolean> {
  //   const urlObj = new URL(url);
  //   return this.mod.remove({ origins: [urlObj.origin + "/*"] });
  // }

  async ensure(url: string, fallback?: () => void): Promise<chrome.permissions.Permissions | void> {
    try {
      let perm = await this.contains(url);
      if (perm) return perm;
      perm = await this.request(url);
      if (perm) return perm;
      if (fallback) return fallback();
    } catch (e) {
      // console.log("[ERROR] PermissionService.ensure", e);
      throw new Error(`Permission denied for URL: ${url}`);
    }
  }
}
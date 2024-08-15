
export default class PermissionService {
  constructor(
    private readonly mod: typeof chrome.permissions = chrome.permissions,
  ) { }

  contains(url: string): Promise<boolean> {
    const urlObj = new URL(url);
    return this.mod.contains({
      origins: [urlObj.origin + "/*"], permissions: [
        "activeTab",
        "scripting",
        "tabs",
      ]
    });
  }

  public capture = {
    grant: () => this.mod.request({ permissions: ["activeTab"], origins: ["<all_urls>"] }),
    granted: () => this.mod.contains({ permissions: ["activeTab"], origins: ["<all_urls>"] }),
  }

  request(url: string): Promise<boolean> {
    const urlObj = new URL(url);
    return this.mod.request({ origins: [urlObj.origin + "/*"] });
  }

  remove(url: string): Promise<boolean> {
    const urlObj = new URL(url);
    return this.mod.remove({ origins: [urlObj.origin + "/*"] });
  }

  async ensure(url: string): Promise<boolean> {
    const yes = await this.contains(url);
    return yes ? yes : await this.request(url);
  }

}
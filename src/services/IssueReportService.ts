
interface IssueEntry {
  title: string;
  body: string;
}

// つまるところ、window.* です
interface InteractionProvider {
  confirm(message: string): boolean;
  prompt(message: string): string | null;
  alert(message: string): void;
  open(url: string): void;
}

abstract class IssueReportPlatform {
  abstract build(title: string, label: string, version: string): Promise<IssueEntry>;
  abstract report(issue: IssueEntry): Promise<{ error?: unknown, messae: string, } | null>;
}

class XTwitterIssueReport implements IssueReportPlatform {
  private static readonly TWITTER_URL = "https://twitter.com/intent/tweet";
  private static readonly AUTHER_ID = "otiai10";
  private static readonly MENTION = `@${XTwitterIssueReport.AUTHER_ID}`;
  constructor(
    private readonly windows: typeof chrome.windows = chrome.windows,
  ) { }
  async build(title: string, label: string, version: string) {
    return {
      title: `【${title}】`,
      body: `バージョン: ${version}-${label}\n事象の詳細: ...\n再現頻度: ...\n再現方法: ...\nいつから起きているか: ... \nどう困っているか: ...\n`,
    };
  }
  async report(issue: IssueEntry) {
    const url = new URL(XTwitterIssueReport.TWITTER_URL);
    url.searchParams.set("text", `${issue.title}\n${issue.body}\n${XTwitterIssueReport.MENTION}`);
    url.searchParams.set("hashtags", "demado");
    await this.windows.create({ url: url.toString() });
    return null;
  }
}

class GitHubIssueReport implements IssueReportPlatform {
  constructor(
    private readonly repo: string,
    private readonly windows: typeof chrome.windows = chrome.windows,
  ) { }
  async build(title: string, label: string, version: string): Promise<IssueEntry> {
    return {
      title: title,
      body: `# バージョン\n${version} ${label}\n\n# 事象の詳細\n...\n\n# 再現頻度\n...\n\n# 再現方法\n...\n\n# いつから起きているか\n...\n\n# どう困っているか\n...\n\n# 開発者にひとこと\n ...\n`,
    };
  }
  async report(issue: IssueEntry) {
    const url = new URL(`${this.repo}/issues/new`);
    url.searchParams.set("title", issue.title);
    url.searchParams.set("body", issue.body);
    await this.windows.create({ url: url.toString() });
    return null;
  }
}

export const IssuePlatforms = {
  XTwitter: XTwitterIssueReport,
  GitHub: GitHubIssueReport,
}

export default class IssueReportService {
  constructor(
    private readonly repo: string = "https://github.com/otiai10/demado",
    private readonly platform: IssueReportPlatform = new GitHubIssueReport(repo),
    private readonly runtime: typeof chrome.runtime = chrome.runtime,
    private readonly interaction: InteractionProvider = window, 
  ) { }
  async report() {
    const issueURL = `${this.repo}/issues?${new URLSearchParams({ q: "is:issue" }).toString()}`;
    if (!this.interaction.confirm(`既存の不具合報告を確認しましたか？\n\n${issueURL}`)) return this.interaction.open(issueURL);
    const contribURL = `${this.repo}/graphs/contributors`;
    if (!this.interaction.confirm(`開発者情報を確認しましたか？\n\n${contribURL}`)) return this.interaction.open(contribURL);
    const title = this.interaction.prompt("まずは問題の概要を簡潔に教えてください");
    if (!title) return this.interaction.alert("よくわからないので中止します");
    // if (this.interaction.confirm(`「${title}」で既存不具合を検索しますか？`)) return this.interaction.open(`${issueURL}&${new URLSearchParams({ q: title }).toString()}`);
    const entry = await this.build(title);
    if (entry) return await this.platform.report(entry);
  }
  async build(title: string) {
    const version = this.runtime.getManifest().version;
    const label = this.runtime.getManifest().name.match(/beta/i) ? "BETA" : "公開版";
    return this.platform.build(title, label, version);
  }
}
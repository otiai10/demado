
export interface ReleaseNoteObject {
  reference: { repo: string };
  announce?: Announce;
  releases: {
    date: string;
    version: string;
    message?: string;
    commits?: { title: string; hash: string; }[];
  }[];
}

export interface Announce {
  message: string;
  effective?: {
    since: AnnounceSinceType;
    until: AnnounceUntilType;
  };
}

type AnnounceSinceType =
  0 | // 最初から
  string; // その他も日時文字列

type AnnounceUntilType =
  "READ" | // 読むまで
  "PERSIST" | // このannouncementがある限りずっと
  string; // その他の日時文字列

function ReleaseEntry({
  date,
  version,
  message = undefined,
  commits = [],
  base,
}: {
  date: string;
  version: string;
  message?: string;
  commits?: { title: string; hash: string; }[];
  base: string;
}) {
  return (
    <div className="mb-4">
      <div className="is-size-7 has-text-grey-light">
        <a href={base + "/releases/tag/" + version} target="_blank">{date}</a>
      </div>
      <div className="is-size-6 has-text-grey-lighter">{version}</div>
      {message ? <div className="is-size-7 demado-balloon-bottom">{message}</div> : null}
      {commits && commits.map(commit => <CommitEntry {...commit} base={base} />)}
    </div>
  )
}

function CommitEntry({
  title, hash, base,
}: {
  title: string; hash: string; base: string;
}) {
  return (
    <div className="is-size-7 has-text-grey-light">
      <a href={base + "/commit/" + hash} target="_blank"><code>{hash.slice(0, 7)}</code></a> {title}
    </div>
  )
}

export function ReleaseNote({ note, }: { note: ReleaseNoteObject; }) {
  return (
    <div className="demado-release-note">
      {note.releases.map(release => <ReleaseEntry {...release} base={note.reference.repo} />)}
    </div>
  )
}
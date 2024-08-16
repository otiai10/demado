
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

export function ReleaseNote({
  note,
}: {
  note: {
    reference: { repo: string };
    releases: {
      date: string;
      version: string;
      commits?: { title: string; hash: string; }[];
    }[];
  };
}) {
  return (
    <div className="demado-release-note">
      {note.releases.map(release => <ReleaseEntry {...release} base={note.reference.repo} />)}
    </div>
  )
}
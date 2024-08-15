
export function CopyRight({
  repository,
}: {
  repository: string;
}) {
  const url = new URL(repository);
  return (
    <div className="level">
      <div className="level-item is-size-7 has-text-grey-lighter">
        <span className="mr-1">Developed by </span>
        <a href={repository.replace(/[^/]+$/,"")} target="_blank"
          className="has-text-warning"
        >{url.pathname.split("/").slice(-2, -1)}</a></div>
    </div>
  )
}
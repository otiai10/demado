import IssueReportService from "../../services/IssueReportService"

export function IssueReport() {
  const reporter = new IssueReportService();
  return (
    <div className="level">
      <div className="level-item is-clickable" onClick={() => {
        reporter.report(); 
      }}>
        <span className="icon has-text-grey-light">
          <i className="fa fa-comments" />
        </span>
        <span className="has-text-grey-light">不具合報告する</span>
      </div>
    </div>
  )
}
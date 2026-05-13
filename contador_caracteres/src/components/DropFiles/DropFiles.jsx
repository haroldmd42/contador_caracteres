/**
 * Reusable file list component.
 * Renders a titled card with downloadable file links.
 *
 * @param {{ title: string, type: string, files: Array<{name: string, size: string, path: string}> }} props
 */
export default function DropFiles({ title, files, type }) {
  return (
    <div className={`drop-files-container ${type}`}>
      <div className="card-header">
        <h3>{title}</h3>
      </div>

      <div className="file-list">
        {files.map((file) => (
          <a
            key={file.name}
            href={file.path}
            download
            className="file-item"
          >
            <span>{file.name}</span>
            <span className="file-size">{file.size}</span>
            <i className="bi bi-download"></i>
          </a>
        ))}
      </div>
    </div>
  );
}
import "./DropFiles.css";

export default function DropFiles({ title, files, type }) {
    return (
        <div className={`drop-files-container ${type}`}>

            <div className="card-header">
                <h3>{title}</h3>
            </div>

            <div className="file-list">
                {files.map((f, index) => (
                    <a
                        key={index}
                        href={f.path}
                        download
                        className="file-item"
                    >
                        <span>{f.name}</span>

                        <span className="file-size">{f.size}</span>

                        <i className="bi bi-download"></i>
                    </a>
                ))}
            </div>

        </div>
    );
}
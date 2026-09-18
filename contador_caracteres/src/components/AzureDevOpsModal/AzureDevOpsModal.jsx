import { useState, useEffect } from 'react';
import {
  fetchWorkItemById,
  queryRecentUserStories,
  fetchTeams,
  fetchTeamIterations,
  queryWorkItemsByIterationPath
} from '../../services/azureDevOpsService';
import './AzureDevOpsModal.css';

export default function AzureDevOpsModal({ isOpen, onClose, onImportUserStory }) {
  const [org, setOrg] = useState(() => sessionStorage.getItem('ado_org') || '');
  const [project, setProject] = useState(() => sessionStorage.getItem('ado_project') || '');
  const [pat, setPat] = useState(() => sessionStorage.getItem('ado_pat') || '');
  const [rememberSession, setRememberSession] = useState(true);

  const [workItemId, setWorkItemId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Teams & Sprints State
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');

  const [iterations, setIterations] = useState([]);
  const [selectedIteration, setSelectedIteration] = useState('');

  const [stories, setStories] = useState([]);

  useEffect(() => {
    if (rememberSession) {
      sessionStorage.setItem('ado_org', org);
      sessionStorage.setItem('ado_project', project);
      sessionStorage.setItem('ado_pat', pat);
    }
  }, [org, project, pat, rememberSession]);

  if (!isOpen) return null;

  const validateCredentials = () => {
    if (!org.trim() || !project.trim() || !pat.trim()) {
      setErrorMessage('Por favor ingresa la Organización, Proyecto y Token PAT.');
      return false;
    }
    return true;
  };

  // 1. Fetch Work Item by ID
  const handleFetchById = async () => {
    setErrorMessage('');
    if (!validateCredentials()) return;
    if (!workItemId.trim()) {
      setErrorMessage('Ingresa el ID del Work Item (Ej: 12345).');
      return;
    }

    try {
      setLoading(true);
      const item = await fetchWorkItemById(org, project, pat, workItemId.trim());
      importItemToIa(item);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Teams (Boards)
  const handleLoadTeams = async () => {
    setErrorMessage('');
    if (!validateCredentials()) return;

    try {
      setLoading(true);
      const teamsList = await fetchTeams(org, project, pat);
      setTeams(teamsList);
      if (teamsList.length > 0) {
        setSelectedTeam(teamsList[0].name);
        handleLoadIterations(teamsList[0].name);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch Iterations (Sprints) for Selected Team
  const handleLoadIterations = async (teamName) => {
    setErrorMessage('');
    if (!validateCredentials()) return;

    try {
      setLoading(true);
      const iterationsList = await fetchTeamIterations(org, project, teamName, pat);
      setIterations(iterationsList);

      // Find current active sprint or first item
      const current = iterationsList.find(i => i.timeFrame === 'current') || iterationsList[0];
      if (current) {
        setSelectedIteration(current.path);
        handleLoadSprintWorkItems(current.path);
      } else {
        setStories([]);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Load Work Items for selected Sprint / Iteration
  const handleLoadSprintWorkItems = async (iterationPath) => {
    setErrorMessage('');
    if (!validateCredentials()) return;

    try {
      setLoading(true);
      const sprintItems = await queryWorkItemsByIterationPath(org, project, iterationPath, pat);
      setStories(sprintItems);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. Query Recent Stories fallback
  const handleQueryRecent = async () => {
    setErrorMessage('');
    if (!validateCredentials()) return;

    try {
      setLoading(true);
      const recent = await queryRecentUserStories(org, project, pat);
      setStories(recent);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const importItemToIa = (item) => {
    const formattedStory = `HU #${item.id}: ${item.title}\n\nDESCRIPCIÓN:\n${item.description}\n\nCRITERIOS DE ACEPTACIÓN:\n${item.acceptanceCriteria}`;
    onImportUserStory(formattedStory, `Estado: ${item.state}\nTipo: ${item.type}`);
    onClose();
  };

  const handleClearCredentials = () => {
    setOrg('');
    setProject('');
    setPat('');
    sessionStorage.removeItem('ado_org');
    sessionStorage.removeItem('ado_project');
    sessionStorage.removeItem('ado_pat');
    setTeams([]);
    setIterations([]);
    setStories([]);
    setErrorMessage('');
  };

  return (
    <div className="modal-backdrop-custom d-flex justify-content-center align-items-center">
      <div className="modal-content-custom card p-4 border-0 shadow-lg position-relative" style={{ maxWidth: '780px', width: '92%' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0 text-primary">
            <i className="bi bi-microsoft me-2"></i>Navegador de Boards y Sprints - Azure DevOps
          </h4>
          <button className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar"></button>
        </div>

        <div className="alert alert-info py-2 small mb-3 border-0">
          <i className="bi bi-shield-lock-fill me-2"></i>
          <strong>Conexión Segura:</strong> Las solicitudes van directo a Azure DevOps API desde tu navegador. El Token (PAT) solo requiere permiso de lectura <code>vso.work</code>.
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2 small mb-3 border-0">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{errorMessage}
          </div>
        )}

        {/* Credentials Inputs */}
        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <label className="small fw-bold mb-1">Organización:</label>
            <input type="text" className="form-control form-control-sm" placeholder="Ej: mi-empresa" value={org} onChange={(e) => setOrg(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="small fw-bold mb-1">Proyecto:</label>
            <input type="text" className="form-control form-control-sm" placeholder="Ej: Plataforma Virtual" value={project} onChange={(e) => setProject(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="small fw-bold mb-1">Token PAT (Lectura vso.work):</label>
            <input type="password" className="form-control form-control-sm" placeholder="Token PAT..." value={pat} onChange={(e) => setPat(e.target.value)} />
          </div>
        </div>

        {/* Top Controls: Load Teams & Clear Credentials */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-success" onClick={handleLoadTeams} disabled={loading}>
              <i className="bi bi-kanban me-1"></i>{loading ? 'Cargando...' : '1. Cargar Boards / Equipos'}
            </button>
            <button className="btn btn-sm btn-outline-primary" onClick={handleQueryRecent} disabled={loading}>
              <i className="bi bi-clock-history me-1"></i>Ver HU Recientes
            </button>
          </div>
          <button className="btn btn-sm btn-outline-secondary" onClick={handleClearCredentials}>
            <i className="bi bi-eraser me-1"></i>Limpiar Credenciales
          </button>
        </div>

        {/* Team & Sprint Selectors */}
        {teams.length > 0 && (
          <div className="row g-2 mb-3 bg-dark p-3 rounded border border-secondary">
            <div className="col-md-6">
              <label className="small fw-bold text-warning mb-1"><i className="bi bi-people-fill me-1"></i>Seleccionar Equipo / Board:</label>
              <select
                className="form-select form-select-sm"
                value={selectedTeam}
                onChange={(e) => {
                  setSelectedTeam(e.target.value);
                  handleLoadIterations(e.target.value);
                }}
              >
                {teams.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="small fw-bold text-info mb-1"><i className="bi bi-calendar-event me-1"></i>Seleccionar Sprint / Iteración:</label>
              <select
                className="form-select form-select-sm"
                value={selectedIteration}
                onChange={(e) => {
                  setSelectedIteration(e.target.value);
                  handleLoadSprintWorkItems(e.target.value);
                }}
              >
                {iterations.map(iter => (
                  <option key={iter.id} value={iter.path}>
                    {iter.timeFrame === 'current' ? '⚡ [SPRINT ACTUAL] ' : ''}{iter.name} ({iter.startDate || ''} - {iter.finishDate || ''})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <hr className="my-2 border-secondary" />

        {/* Search by Work Item ID */}
        <div className="mb-3">
          <label className="fw-semibold small mb-1">Cargar por ID de Work Item directo:</label>
          <div className="input-group input-group-sm">
            <input type="number" className="form-control" placeholder="Ej: 12345" value={workItemId} onChange={(e) => setWorkItemId(e.target.value)} />
            <button className="btn btn-primary" onClick={handleFetchById} disabled={loading}>
              <i className="bi bi-download me-1"></i>{loading ? 'Cargando...' : 'Cargar por ID'}
            </button>
          </div>
        </div>

        {/* Stories List */}
        {stories.length > 0 ? (
          <div>
            <label className="fw-semibold small mb-2 text-success">
              <i className="bi bi-card-checklist me-1"></i>Historias de Usuario del Sprint ({stories.length}):
            </label>
            <div className="list-group overflow-auto" style={{ maxHeight: '220px' }}>
              {stories.map((story) => (
                <button
                  key={story.id}
                  className="list-group-item list-group-item-action bg-dark text-white border-secondary d-flex justify-content-between align-items-center mb-1 rounded"
                  onClick={() => importItemToIa(story)}
                >
                  <div>
                    <span className="badge bg-primary me-2">#{story.id}</span>
                    <strong className="text-info me-2">[{story.type}]</strong>
                    <span>{story.title}</span>
                    <div className="small text-muted mt-1">Estado: <span className="text-warning">{story.state}</span></div>
                  </div>
                  <span className="btn btn-sm btn-outline-success">
                    Importar <i className="bi bi-arrow-right me-0 ms-1"></i>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          teams.length > 0 && !loading && (
            <div className="alert alert-secondary py-2 small text-center mb-0">
              No se encontraron Historias de Usuario activas en este Sprint. Selecciona otro Sprint o Equipo arriba.
            </div>
          )
        )}
      </div>
    </div>
  );
}

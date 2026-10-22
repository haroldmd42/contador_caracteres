import { useState, useEffect, useMemo } from 'react';
import {
  fetchTeams,
  fetchTeamIterations,
  queryWorkItemsByMultipleIterations,
  fetchWorkItemById,
  cleanAndFormatStoryText
} from '../../services/azureDevOpsService';
import {
  exportSingleHUToExcel,
  exportMultipleHUsToExcel
} from '../../utils/azureExcelExport';
import useClipboard from '../../hooks/useClipboard';
import Toast from '../../components/ui/Toast/Toast';
import './AzureExtractor.css';

export default function AzureExtractor() {
  // Credentials State
  const [org, setOrg] = useState(() => sessionStorage.getItem('ado_org') || '');
  const [project, setProject] = useState(() => sessionStorage.getItem('ado_project') || '');
  const [pat, setPat] = useState(() => sessionStorage.getItem('ado_pat') || '');
  const [rememberSession, setRememberSession] = useState(true);
  const [showPat, setShowPat] = useState(false);
  const [isCredentialsCollapsed, setIsCredentialsCollapsed] = useState(() => {
    return Boolean(sessionStorage.getItem('ado_org') && sessionStorage.getItem('ado_project') && sessionStorage.getItem('ado_pat'));
  });

  // Workflow State: 'select' | 'results'
  const [activeTab, setActiveTab] = useState('select');

  // Teams & Sprints
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [iterations, setIterations] = useState([]);
  const [selectedIterationPaths, setSelectedIterationPaths] = useState([]);
  const [sprintSearch, setSprintSearch] = useState('');

  // Work Items in Sprint(s)
  const [availableStories, setAvailableStories] = useState([]);
  const [selectedStoryIds, setSelectedStoryIds] = useState([]);
  const [manualWorkItemId, setManualWorkItemId] = useState('');

  // Filters for available stories
  const [storySearch, setStorySearch] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
  const [selectedSprintFilter, setSelectedSprintFilter] = useState('ALL');

  // Extracted Results State
  const [extractedStories, setExtractedStories] = useState([]);
  const [resultSearch, setResultSearch] = useState('');

  // UI Loaders & Alerts
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingIterations, setLoadingIterations] = useState(false);
  const [loadingStories, setLoadingStories] = useState(false);
  const [loadingManualId, setLoadingManualId] = useState(false);
  const [loadingExcelExport, setLoadingExcelExport] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Track copied state per story card
  const [copiedCardId, setCopiedCardId] = useState(null);

  const { copyToClipboard } = useClipboard();

  // Save credentials to sessionStorage
  useEffect(() => {
    if (rememberSession) {
      sessionStorage.setItem('ado_org', org);
      sessionStorage.setItem('ado_project', project);
      sessionStorage.setItem('ado_pat', pat);
    }
  }, [org, project, pat, rememberSession]);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const validateCredentials = () => {
    if (!org.trim() || !project.trim() || !pat.trim()) {
      setErrorMessage('Ingresa la Organización, Proyecto y Token PAT de Azure DevOps.');
      return false;
    }
    return true;
  };

  // 1. Load Teams / Boards
  const handleLoadTeams = async () => {
    setErrorMessage('');
    if (!validateCredentials()) return;

    try {
      setLoadingTeams(true);
      const teamsList = await fetchTeams(org, project, pat);
      setTeams(teamsList);
      if (teamsList.length > 0) {
        setSelectedTeam(teamsList[0].name);
        handleLoadIterations(teamsList[0].name);
        setIsCredentialsCollapsed(true);
      } else {
        setErrorMessage('No se encontraron Boards/Equipos en este proyecto de Azure DevOps.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error al conectar con Azure DevOps.');
    } finally {
      setLoadingTeams(false);
    }
  };

  // 2. Load Iterations for a Team
  const handleLoadIterations = async (teamName) => {
    setErrorMessage('');
    if (!validateCredentials()) return;

    try {
      setLoadingIterations(true);
      const iterList = await fetchTeamIterations(org, project, teamName, pat);
      setIterations(iterList);

      // Auto-select current active sprint if present
      const current = iterList.find(i => i.timeFrame === 'current');
      if (current) {
        setSelectedIterationPaths([current.path]);
      } else if (iterList.length > 0) {
        setSelectedIterationPaths([iterList[0].path]);
      } else {
        setSelectedIterationPaths([]);
      }
      setAvailableStories([]);
      setSelectedStoryIds([]);
    } catch (err) {
      setErrorMessage(err.message || 'Error al obtener Sprints del equipo.');
    } finally {
      setLoadingIterations(false);
    }
  };

  // Toggle Sprint selection
  const handleToggleSprint = (path) => {
    setSelectedIterationPaths(prev => {
      if (prev.includes(path)) {
        return prev.filter(p => p !== path);
      } else {
        return [...prev, path];
      }
    });
  };

  const handleSelectCurrentSprint = () => {
    const current = iterations.find(i => i.timeFrame === 'current');
    if (current) {
      setSelectedIterationPaths([current.path]);
    } else {
      showNotification('No hay un Sprint marcado como actual en Azure.');
    }
  };

  const handleSelectRecentSprints = () => {
    if (iterations.length === 0) return;
    const paths = iterations.slice(-3).map(i => i.path);
    setSelectedIterationPaths(paths);
  };

  const handleSelectAllSprints = () => {
    setSelectedIterationPaths(iterations.map(i => i.path));
  };

  const handleClearSprints = () => {
    setSelectedIterationPaths([]);
  };

  // 3. Search and Load Work Items across selected sprints
  const handleFetchSprintStories = async () => {
    setErrorMessage('');
    if (!validateCredentials()) return;
    if (selectedIterationPaths.length === 0) {
      setErrorMessage('Por favor selecciona al menos un Sprint para consultar historias.');
      return;
    }

    try {
      setLoadingStories(true);
      const items = await queryWorkItemsByMultipleIterations(org, project, selectedIterationPaths, pat);
      setAvailableStories(items);
      setSelectedStoryIds(items.map(item => item.id));
      if (items.length === 0) {
        showNotification('No se encontraron historias de usuario en los sprints seleccionados.');
      } else {
        showNotification(`Se encontraron ${items.length} historias en ${selectedIterationPaths.length} sprint(s).`);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error al consultar Historias de Usuario.');
    } finally {
      setLoadingStories(false);
    }
  };

  // Add individual story by ID to the available list
  const handleAddManualId = async () => {
    if (!manualWorkItemId.trim()) return;
    if (!validateCredentials()) return;

    try {
      setLoadingManualId(true);
      const item = await fetchWorkItemById(org, project, pat, manualWorkItemId.trim());
      setAvailableStories(prev => {
        const exists = prev.some(i => i.id === item.id);
        if (exists) {
          showNotification(`La historia #${item.id} ya está en la lista.`);
          return prev;
        }
        return [item, ...prev];
      });
      setSelectedStoryIds(prev => Array.from(new Set([...prev, item.id])));
      setManualWorkItemId('');
      showNotification(`Historia #${item.id} agregada exitosamente.`);
    } catch (err) {
      setErrorMessage(err.message || `No se pudo obtener el Work Item #${manualWorkItemId}`);
    } finally {
      setLoadingManualId(false);
    }
  };

  // Selection toggle for stories
  const handleToggleStory = (id) => {
    setSelectedStoryIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllStories = (filteredItems) => {
    const idsToAdd = filteredItems.map(i => i.id);
    setSelectedStoryIds(prev => Array.from(new Set([...prev, ...idsToAdd])));
  };

  const handleDeselectAllStories = (filteredItems) => {
    const idsToRemove = new Set(filteredItems.map(i => i.id));
    setSelectedStoryIds(prev => prev.filter(id => !idsToRemove.has(id)));
  };

  // 4. Execute Extraction of Selected Stories
  const handleExecuteExtraction = () => {
    if (selectedStoryIds.length === 0) {
      setErrorMessage('Selecciona al menos una Historia de Usuario para extraer.');
      return;
    }

    const selectedItems = availableStories.filter(story => selectedStoryIds.includes(story.id));
    setExtractedStories(selectedItems);
    setActiveTab('results');
    showNotification(`¡Extracción completada! ${selectedItems.length} Historias listas.`);
  };

  // Format HU content for copying
  const formatStoryToClipboard = (story) => {
    const desc = cleanAndFormatStoryText(story.description, 'description') || 'Sin descripción registrada.';
    const crit = cleanAndFormatStoryText(story.acceptanceCriteria, 'criteria') || 'Sin criterios de aceptación registrados.';
    return [
      `================================================================================`,
      `HISTORIA DE USUARIO: #${story.id} - ${story.title}`,
      `================================================================================`,
      `Tipo: ${story.type} | Estado: ${story.state} | Sprint: ${story.sprintName}`,
      `Asignado a: ${story.assignedTo}`,
      `Enlace Azure: ${story.url}`,
      ``,
      `--------------------------------------------------------------------------------`,
      `DESCRIPCIÓN:`,
      `--------------------------------------------------------------------------------`,
      desc,
      ``,
      `--------------------------------------------------------------------------------`,
      `CRITERIOS DE ACEPTACIÓN:`,
      `--------------------------------------------------------------------------------`,
      crit,
      `================================================================================`
    ].join('\n');
  };

  // Copy single story
  const handleCopySingle = (story) => {
    const text = formatStoryToClipboard(story);
    copyToClipboard(text);
    setCopiedCardId(story.id);
    showNotification(`HU #${story.id} copiada al portapapeles.`);
    setTimeout(() => {
      setCopiedCardId(prev => (prev === story.id ? null : prev));
    }, 2500);
  };

  // Copy all extracted stories
  const handleCopyAll = () => {
    if (extractedStories.length === 0) return;
    const allText = extractedStories.map(story => formatStoryToClipboard(story)).join('\n\n\n');
    copyToClipboard(allText);
    showNotification(`¡Se copiaron las ${extractedStories.length} Historias de Usuario al portapapeles!`);
  };

  // Download single HU in Excel
  const handleDownloadSingleExcel = async (story) => {
    try {
      await exportSingleHUToExcel(story, project, org);
      showNotification(`Descargando Excel para HU #${story.id}...`);
    } catch (err) {
      setErrorMessage(`Error al generar Excel: ${err.message}`);
    }
  };

  // Download all extracted HUs in multi-sheet Excel
  const handleDownloadAllExcel = async () => {
    if (extractedStories.length === 0) return;
    try {
      setLoadingExcelExport(true);
      const sprintNames = Array.from(new Set(extractedStories.map(s => s.sprintName)));
      await exportMultipleHUsToExcel(extractedStories, project, org, sprintNames);
      showNotification(`¡Reporte consolidado con ${extractedStories.length} hojas generado exitosamente!`);
    } catch (err) {
      setErrorMessage(`Error al generar el consolidado Excel: ${err.message}`);
    } finally {
      setLoadingExcelExport(false);
    }
  };

  // Clear credentials
  const handleClearCredentials = () => {
    setOrg('');
    setProject('');
    setPat('');
    sessionStorage.removeItem('ado_org');
    sessionStorage.removeItem('ado_project');
    sessionStorage.removeItem('ado_pat');
    setTeams([]);
    setIterations([]);
    setSelectedIterationPaths([]);
    setAvailableStories([]);
    setSelectedStoryIds([]);
    setExtractedStories([]);
    setIsCredentialsCollapsed(false);
    setActiveTab('select');
    showNotification('Credenciales de sesión eliminadas.');
  };

  // Filter available iterations by search
  const filteredIterations = useMemo(() => {
    if (!sprintSearch.trim()) return iterations;
    const q = sprintSearch.toLowerCase();
    return iterations.filter(i => i.name.toLowerCase().includes(q) || i.path.toLowerCase().includes(q));
  }, [iterations, sprintSearch]);

  // Unique types, states, sprints for filters
  const uniqueStoryTypes = useMemo(() => {
    return Array.from(new Set(availableStories.map(s => s.type))).filter(Boolean);
  }, [availableStories]);

  const uniqueStoryStates = useMemo(() => {
    return Array.from(new Set(availableStories.map(s => s.state))).filter(Boolean);
  }, [availableStories]);

  const uniqueStorySprints = useMemo(() => {
    return Array.from(new Set(availableStories.map(s => s.sprintName))).filter(Boolean);
  }, [availableStories]);

  // Filter available stories
  const filteredAvailableStories = useMemo(() => {
    return availableStories.filter(story => {
      const matchSearch =
        !storySearch.trim() ||
        String(story.id).includes(storySearch.trim()) ||
        story.title.toLowerCase().includes(storySearch.toLowerCase()) ||
        story.assignedTo.toLowerCase().includes(storySearch.toLowerCase());

      const matchType = selectedTypeFilter === 'ALL' || story.type === selectedTypeFilter;
      const matchState = selectedStateFilter === 'ALL' || story.state === selectedStateFilter;
      const matchSprint = selectedSprintFilter === 'ALL' || story.sprintName === selectedSprintFilter;

      return matchSearch && matchType && matchState && matchSprint;
    });
  }, [availableStories, storySearch, selectedTypeFilter, selectedStateFilter, selectedSprintFilter]);

  // Filter extracted stories in results tab
  const filteredExtractedStories = useMemo(() => {
    if (!resultSearch.trim()) return extractedStories;
    const q = resultSearch.toLowerCase();
    return extractedStories.filter(s =>
      String(s.id).includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.acceptanceCriteria.toLowerCase().includes(q) ||
      s.sprintName.toLowerCase().includes(q)
    );
  }, [extractedStories, resultSearch]);

  // Total Story Points extracted
  const totalStoryPoints = useMemo(() => {
    return extractedStories.reduce((acc, s) => acc + (Number(s.storyPoints) || 0), 0);
  }, [extractedStories]);

  // Badge class helpers
  const getTypeBadgeClass = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('bug')) return 'badge-type-bug';
    if (t.includes('feature')) return 'badge-type-feature';
    if (t.includes('epic')) return 'badge-type-epic';
    if (t.includes('requirement')) return 'badge-type-req';
    return 'badge-type-story';
  };

  const getStateBadgeClass = (state = '') => {
    const s = state.toLowerCase();
    if (s === 'active' || s === 'doing' || s === 'in progress' || s === 'in stage') return 'badge-state-active';
    if (s === 'resolved' || s === 'closed' || s === 'done') return 'badge-state-done';
    if (s === 'new' || s === 'to do') return 'badge-state-new';
    return 'badge-state-other';
  };

  const hasActiveFilters = storySearch || selectedSprintFilter !== 'ALL' || selectedTypeFilter !== 'ALL' || selectedStateFilter !== 'ALL';

  return (
    <div className="azure-extractor-page">
      <Toast message={toastMessage} visible={toastVisible} />

      {/* =========================================================================
          HEADER BAR / COMMAND STRIP
          ========================================================================= */}
      <header className="extractor-command-header shadow-sm">
        <div className="command-header-main">
          <div className="brand-group">
            <div className="azure-badge-icon">
              <i className="bi bi-microsoft"></i>
            </div>
            <div>
              <div className="title-row">
                <h1 className="tool-title">Extractor de Historias de Usuario Azure</h1>
                <span className="api-tag">API v7.0</span>
              </div>
              <p className="tool-subtitle">
                Extrae requerimientos y criterios de aceptación por Sprints múltiples con exportación individual y multi-hoja a Excel.
              </p>
            </div>
          </div>

          {/* Workflow Tabs */}
          <div className="workflow-switch">
            <button
              className={`workflow-tab-btn ${activeTab === 'select' ? 'active' : ''}`}
              onClick={() => setActiveTab('select')}
            >
              <i className="bi bi-kanban me-1.5"></i>
              <span>1. Selección</span>
              {selectedStoryIds.length > 0 && (
                <span className="count-chip">{selectedStoryIds.length}</span>
              )}
            </button>
            <button
              className={`workflow-tab-btn ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => {
                if (extractedStories.length === 0 && selectedStoryIds.length > 0) {
                  handleExecuteExtraction();
                } else {
                  setActiveTab('results');
                }
              }}
              disabled={extractedStories.length === 0 && selectedStoryIds.length === 0}
            >
              <i className="bi bi-file-earmark-spreadsheet me-1.5"></i>
              <span>2. Historias Extraídas</span>
              {extractedStories.length > 0 && (
                <span className="count-chip active-chip">{extractedStories.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {errorMessage && (
        <div className="alert alert-danger custom-alert d-flex align-items-center justify-content-between my-3 shadow-sm" role="alert">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill text-danger fs-5"></i>
            <span className="small fw-medium">{errorMessage}</span>
          </div>
          <button className="btn-close btn-sm" onClick={() => setErrorMessage('')} aria-label="Cerrar"></button>
        </div>
      )}

      {/* =========================================================================
          TAB 1: SPRINTS & STORIES SELECTION
          ========================================================================= */}
      {activeTab === 'select' && (
        <div className="extractor-workspace-grid mt-3">
          {/* ==================== LEFT COLUMN (SIDEBAR) ==================== */}
          <aside className="extractor-sidebar">
            {/* Connection Card: Collapsed Mode */}
            {isCredentialsCollapsed && teams.length > 0 ? (
              <div className="connection-collapsed-card mb-3">
                <div className="connection-main-info">
                  <div className="connection-icon-wrapper flex-shrink-0">
                    <i className="bi bi-cloud-check-fill text-success"></i>
                  </div>
                  <div className="connection-text-block">
                    <div className="connection-org-project" title={`${org} / ${project}`}>
                      <strong>{org}</strong> <span className="text-muted fw-normal">/</span> {project}
                    </div>
                    <div className="connection-status-label">
                      <span className="live-pulse-dot"></span>
                      <span>Sesión Azure conectada</span>
                    </div>
                  </div>
                </div>
                <div className="connection-action-btns">
                  <button
                    type="button"
                    className="btn-conn-edit"
                    onClick={() => setIsCredentialsCollapsed(false)}
                    title="Editar parámetros de conexión"
                  >
                    <i className="bi bi-pencil-square me-1"></i>
                    <span>Editar</span>
                  </button>
                  <button
                    type="button"
                    className="btn-conn-disconnect"
                    onClick={handleClearCredentials}
                    title="Desconectar y limpiar sesión"
                  >
                    <i className="bi bi-power"></i>
                  </button>
                </div>
              </div>
            ) : (
              /* Connection Card: Expanded Form */
              <div className="card panel-card mb-3">
                <div className="panel-header-strip">
                  <span className="panel-title-sm d-flex align-items-center gap-2">
                    <i className="bi bi-shield-lock-fill text-primary"></i>
                    <span>Conexión Azure DevOps</span>
                  </span>
                  {teams.length > 0 && (
                    <button
                      className="btn btn-xs btn-link text-decoration-none text-muted p-0"
                      onClick={() => setIsCredentialsCollapsed(true)}
                    >
                      Minimizar
                    </button>
                  )}
                </div>

                <div className="credentials-form-fields">
                  <div>
                    <label className="field-label">Organización:</label>
                    <input
                      type="text"
                      className="form-control modern-input"
                      placeholder="Ej: mi-empresa"
                      value={org}
                      onChange={(e) => setOrg(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="field-label">Proyecto:</label>
                    <input
                      type="text"
                      className="form-control modern-input"
                      placeholder="Ej: Plataforma Web"
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="field-label">
                      <span>Token PAT (Lectura vso.work):</span>
                      <button
                        type="button"
                        className="btn btn-link btn-xs p-0 text-decoration-none text-muted"
                        onClick={() => setShowPat(!showPat)}
                      >
                        {showPat ? 'Ocultar' : 'Ver'}
                      </button>
                    </div>
                    <input
                      type={showPat ? 'text' : 'password'}
                      className="form-control modern-input"
                      placeholder="Token PAT de Azure..."
                      value={pat}
                      onChange={(e) => setPat(e.target.value)}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-1">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberCheck"
                        checked={rememberSession}
                        onChange={(e) => setRememberSession(e.target.checked)}
                      />
                      <label className="form-check-label xs-text text-secondary ms-1" htmlFor="rememberCheck">
                        Recordar sesión
                      </label>
                    </div>
                    <button
                      className="btn btn-xs btn-link text-danger text-decoration-none p-0"
                      onClick={handleClearCredentials}
                    >
                      Limpiar
                    </button>
                  </div>

                  <button
                    className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm py-2"
                    onClick={handleLoadTeams}
                    disabled={loadingTeams}
                  >
                    {loadingTeams ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span>Conectando...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right"></i>
                        <span>Conectar y Cargar Boards</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Sprints Panel */}
            <div className="card panel-card flex-grow-1 d-flex flex-column">
              <div className="panel-header-strip">
                <span className="panel-title-sm d-flex align-items-center gap-2">
                  <i className="bi bi-calendar-week-fill text-warning"></i>
                  <span>Sprints / Iteraciones</span>
                </span>
                <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1" style={{ fontSize: '0.75rem' }}>
                  {selectedIterationPaths.length} seleccionados
                </span>
              </div>

              {teams.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  <i className="bi bi-kanban fs-3 d-block mb-1 opacity-50"></i>
                  Conecta tu cuenta arriba para cargar los equipos y sprints.
                </div>
              ) : (
                <>
                  {/* Team Selector */}
                  <div className="mb-2.5">
                    <label className="field-label mb-1">
                      <i className="bi bi-people-fill me-1 text-primary"></i>Board / Equipo:
                    </label>
                    <select
                      className="form-select form-select-sm modern-input"
                      value={selectedTeam}
                      onChange={(e) => {
                        setSelectedTeam(e.target.value);
                        handleLoadIterations(e.target.value);
                      }}
                      disabled={loadingIterations}
                    >
                      {teams.map(t => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sprint Quick Presets: Balanced 2x2 Grid with zero text wrapping */}
                  <div className="sprint-presets-grid mb-2.5">
                    <button
                      type="button"
                      className="preset-chip-btn chip-actual"
                      onClick={handleSelectCurrentSprint}
                      title="Seleccionar Sprint activo"
                    >
                      <i className="bi bi-lightning-charge-fill me-1 text-warning"></i>
                      <span>Sprint Actual</span>
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={handleSelectRecentSprints}
                      title="Seleccionar últimos 3 sprints"
                    >
                      <i className="bi bi-clock-history me-1 text-primary"></i>
                      <span>Últimos 3</span>
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={handleSelectAllSprints}
                      title="Seleccionar todos los sprints"
                    >
                      <i className="bi bi-check-all me-1 text-success"></i>
                      <span>Todos</span>
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn chip-clear"
                      onClick={handleClearSprints}
                      title="Limpiar selección de sprints"
                    >
                      <i className="bi bi-x-circle me-1 text-danger"></i>
                      <span>Limpiar</span>
                    </button>
                  </div>

                  {/* Filter Search */}
                  <div className="azure-search-box azure-search-box-sm mb-2.5">
                    <i className="bi bi-search azure-search-icon"></i>
                    <input
                      type="text"
                      className="azure-search-field"
                      placeholder="Filtrar sprint..."
                      value={sprintSearch}
                      onChange={(e) => setSprintSearch(e.target.value)}
                    />
                    {sprintSearch && (
                      <button
                        type="button"
                        className="azure-search-clear"
                        onClick={() => setSprintSearch('')}
                        title="Limpiar filtro de sprint"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    )}
                  </div>

                  {/* Sprints Scroll Area */}
                  <div className="sprints-scroll-container flex-grow-1 rounded">
                    {loadingIterations ? (
                      <div className="text-center py-4 text-muted small">
                        <span className="spinner-border spinner-border-sm me-1.5"></span>
                        <span>Cargando sprints...</span>
                      </div>
                    ) : filteredIterations.length === 0 ? (
                      <div className="text-center py-4 text-muted xs-text">
                        No se encontraron sprints que coincidan.
                      </div>
                    ) : (
                      filteredIterations.map(iter => {
                        const isSelected = selectedIterationPaths.includes(iter.path);
                        const isCurrent = iter.timeFrame === 'current';
                        return (
                          <div
                            key={iter.id}
                            className={`sprint-compact-row ${isSelected ? 'selected' : ''} ${isCurrent ? 'current-sprint' : ''}`}
                            onClick={() => handleToggleSprint(iter.path)}
                          >
                            <input
                              className="form-check-input flex-shrink-0"
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                            />
                            <div className="sprint-info min-w-0 flex-grow-1">
                              <div className="d-flex align-items-center gap-1.5">
                                <span className="sprint-name text-truncate">{iter.name}</span>
                                {isCurrent && (
                                  <span className="badge bg-warning text-dark current-badge">Actual</span>
                                )}
                              </div>
                              {(iter.startDate || iter.finishDate) && (
                                <div className="sprint-date-text">
                                  {iter.startDate || ''} - {iter.finishDate || ''}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Fetch Work Items Action Button */}
                  <button
                    className="btn btn-azure-action w-100 mt-2.5 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    onClick={handleFetchSprintStories}
                    disabled={loadingStories || selectedIterationPaths.length === 0}
                  >
                    {loadingStories ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span>Consultando Azure...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search"></i>
                        <span>Buscar Historias ({selectedIterationPaths.length} Sprints)</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </aside>

          {/* ==================== RIGHT COLUMN (STORY BROWSER) ==================== */}
          <main className="extractor-main-panel">
            <div className="card panel-card h-100 d-flex flex-column">
              {/* Header Strip with Direct ID Input */}
              <div className="browser-header-strip">
                <div>
                  <h2 className="panel-title">Historias de Usuario Disponibles</h2>
                  <p className="panel-subtitle">
                    Marca las historias que deseas incluir en esta extracción para procesarlas y exportarlas.
                  </p>
                </div>

                {/* Direct ID Loader: Unified Seamless Single-Border Control */}
                <div className="direct-id-adder-box">
                  <div className="direct-id-unified-control">
                    <span className="direct-id-prefix" title="Identificador Work Item de Azure DevOps">
                      <i className="bi bi-hash"></i>
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="direct-id-input"
                      placeholder="ID directo (12345)..."
                      value={manualWorkItemId}
                      onChange={(e) => setManualWorkItemId(e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddManualId()}
                    />
                    <button
                      type="button"
                      className="direct-id-btn-submit"
                      onClick={handleAddManualId}
                      disabled={loadingManualId || !manualWorkItemId.trim()}
                      title="Cargar Work Item por ID específico"
                    >
                      {loadingManualId ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <>
                          <i className="bi bi-plus-lg me-1"></i>
                          <span>Agregar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Toolbar: Perfectly aligned in one row */}
              {availableStories.length > 0 && (
                <div className="story-filter-toolbar mb-3">
                  <div className="filter-row">
                    {/* Search Input */}
                    <div className="filter-search-col">
                      <div className="azure-search-box">
                        <i className="bi bi-search azure-search-icon"></i>
                        <input
                          type="text"
                          className="azure-search-field"
                          placeholder="Buscar por ID, título o responsable..."
                          value={storySearch}
                          onChange={(e) => setStorySearch(e.target.value)}
                        />
                        {storySearch && (
                          <button
                            type="button"
                            className="azure-search-clear"
                            onClick={() => setStorySearch('')}
                            title="Limpiar búsqueda"
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Sprint Filter */}
                    {uniqueStorySprints.length > 1 && (
                      <div className="filter-select-col">
                        <select
                          className="form-select form-select-sm"
                          value={selectedSprintFilter}
                          onChange={(e) => setSelectedSprintFilter(e.target.value)}
                        >
                          <option value="ALL">Todos los Sprints</option>
                          {uniqueStorySprints.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Type Filter */}
                    {uniqueStoryTypes.length > 1 && (
                      <div className="filter-select-col">
                        <select
                          className="form-select form-select-sm"
                          value={selectedTypeFilter}
                          onChange={(e) => setSelectedTypeFilter(e.target.value)}
                        >
                          <option value="ALL">Todos los Tipos</option>
                          {uniqueStoryTypes.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* State Filter */}
                    {uniqueStoryStates.length > 1 && (
                      <div className="filter-select-col">
                        <select
                          className="form-select form-select-sm"
                          value={selectedStateFilter}
                          onChange={(e) => setSelectedStateFilter(e.target.value)}
                        >
                          <option value="ALL">Todos los Estados</option>
                          {uniqueStoryStates.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Clear Filters Button if any active */}
                    {hasActiveFilters && (
                      <button
                        className="btn btn-xs btn-outline-secondary rounded-pill py-1 px-2.5 flex-shrink-0"
                        onClick={() => {
                          setStorySearch('');
                          setSelectedSprintFilter('ALL');
                          setSelectedTypeFilter('ALL');
                          setSelectedStateFilter('ALL');
                        }}
                        title="Restablecer filtros"
                      >
                        <i className="bi bi-arrow-counterclockwise me-1"></i>Limpiar
                      </button>
                    )}
                  </div>

                  {/* Action Bar: Select Visible / Count */}
                  <div className="selection-sub-bar mt-2.5 pt-2 border-top border-subtle">
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-xs btn-outline-primary rounded-pill py-1 px-2.5 fw-semibold"
                        onClick={() => handleSelectAllStories(filteredAvailableStories)}
                      >
                        <i className="bi bi-check-all me-1"></i>Seleccionar Visibles ({filteredAvailableStories.length})
                      </button>
                      <button
                        className="btn btn-xs btn-outline-secondary rounded-pill py-1 px-2.5"
                        onClick={() => handleDeselectAllStories(filteredAvailableStories)}
                      >
                        <i className="bi bi-dash me-1"></i>Deseleccionar
                      </button>
                    </div>

                    <div className="selected-counter-pill">
                      <span className="dot-indicator"></span>
                      <span>
                        Seleccionadas: <strong>{selectedStoryIds.length}</strong> de {availableStories.length}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Story Rows List */}
              <div className="stories-viewport flex-grow-1 overflow-auto rounded">
                {loadingStories ? (
                  <div className="state-placeholder">
                    <div className="spinner-border text-primary mb-2.5" role="status"></div>
                    <h6 className="fw-bold mb-1">Cargando Historias de Usuario...</h6>
                    <p className="text-secondary small mb-0">Consultando elementos y criterios de aceptación desde Azure DevOps.</p>
                  </div>
                ) : availableStories.length === 0 ? (
                  <div className="state-placeholder">
                    <div className="state-icon mb-2.5">
                      <i className="bi bi-folder2-open display-4 text-secondary opacity-50"></i>
                    </div>
                    <h6 className="fw-bold mb-1">Sin Historias de Usuario cargadas</h6>
                    <p className="text-secondary small mb-0 max-w-400">
                      {teams.length === 0
                        ? 'Ingresa tus credenciales en el panel izquierdo y presiona "Conectar y Cargar Boards".'
                        : 'Selecciona uno o más sprints arriba y presiona "Buscar Historias" para listarlas.'}
                    </p>
                  </div>
                ) : filteredAvailableStories.length === 0 ? (
                  <div className="state-placeholder">
                    <i className="bi bi-funnel fs-2 text-secondary opacity-50 mb-2"></i>
                    <h6 className="fw-bold mb-1">No hay historias que coincidan</h6>
                    <p className="text-secondary small mb-0">Intenta cambiar o limpiar los filtros seleccionados.</p>
                  </div>
                ) : (
                  <div className="stories-stack">
                    {filteredAvailableStories.map(story => {
                      const isChecked = selectedStoryIds.includes(story.id);
                      return (
                        <div
                          key={story.id}
                          className={`story-tile ${isChecked ? 'story-tile-selected' : ''}`}
                          onClick={() => handleToggleStory(story.id)}
                        >
                          <div className="story-tile-left">
                            <input
                              className="form-check-input story-tile-checkbox"
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                            />
                          </div>

                          <div className="story-tile-content">
                            {/* Badges line */}
                            <div className="story-badges-line">
                              <span className="story-id-tag">#{story.id}</span>
                              <span className={`story-type-badge ${getTypeBadgeClass(story.type)}`}>
                                {story.type}
                              </span>
                              <span className={`story-state-badge ${getStateBadgeClass(story.state)}`}>
                                <span className="state-dot"></span>
                                {story.state}
                              </span>
                              <span className="story-sprint-badge">
                                <i className="bi bi-calendar3 me-1"></i>{story.sprintName}
                              </span>
                              {story.storyPoints !== null && (
                                <span className="story-points-badge">
                                  {story.storyPoints} pts
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className="story-heading">
                              {story.title}
                            </h3>

                            {/* Meta info footer */}
                            <div className="story-meta-line">
                              <span className="meta-item">
                                <i className="bi bi-person me-1"></i>{story.assignedTo}
                              </span>
                              {story.acceptanceCriteria ? (
                                <span className="meta-item text-success fw-medium">
                                  <i className="bi bi-check-circle-fill me-1"></i>Con Criterios
                                </span>
                              ) : (
                                <span className="meta-item text-muted">
                                  <i className="bi bi-dash-circle me-1"></i>Sin Criterios
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="story-tile-right">
                            <a
                              href={story.url}
                              target="_blank"
                              rel="noreferrer"
                              className="story-external-link-btn"
                              onClick={(e) => e.stopPropagation()}
                              title="Abrir en Azure DevOps"
                            >
                              <i className="bi bi-box-arrow-up-right"></i>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Sticky Action Strip */}
              {availableStories.length > 0 && (
                <div className="stories-docked-footer mt-auto pt-3 border-top border-subtle">
                  <div className="dock-meta">
                    <i className="bi bi-layers-fill text-primary me-1.5"></i>
                    <span>
                      <strong>{selectedStoryIds.length}</strong> historias seleccionadas para la extracción.
                    </span>
                  </div>

                  <button
                    className="btn btn-primary btn-extract-cta d-flex align-items-center gap-2 shadow"
                    onClick={handleExecuteExtraction}
                    disabled={selectedStoryIds.length === 0}
                  >
                    <i className="bi bi-cloud-download-fill"></i>
                    <span>Extraer Historias Seleccionadas ({selectedStoryIds.length})</span>
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* =========================================================================
          TAB 2: RESULTS (EXTRACTED CARDS & EXCEL DOWNLOADS)
          ========================================================================= */}
      {activeTab === 'results' && (
        <div className="extractor-results-view mt-3">
          {/* Executive KPI Bar */}
          <div className="card panel-card mb-4 shadow-sm">
            <div className="results-top-strip">
              {/* KPI Cards */}
              <div className="kpi-group">
                <div className="kpi-card">
                  <div className="kpi-label">HUs Procesadas</div>
                  <div className="kpi-num text-primary">{extractedStories.length}</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Sprints Incluidos</div>
                  <div className="kpi-num text-info">
                    {Array.from(new Set(extractedStories.map(s => s.sprintName))).length}
                  </div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Con Criterios</div>
                  <div className="kpi-num text-success">
                    {extractedStories.filter(s => s.acceptanceCriteria).length}
                  </div>
                </div>
                {totalStoryPoints > 0 && (
                  <div className="kpi-card">
                    <div className="kpi-label">Total Story Points</div>
                    <div className="kpi-num text-warning">{totalStoryPoints} pts</div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="results-actions-group">
                <button
                  className="btn btn-success btn-excel-bulk shadow-sm"
                  onClick={handleDownloadAllExcel}
                  disabled={loadingExcelExport || extractedStories.length === 0}
                >
                  {loadingExcelExport ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1.5"></span>
                      <span>Generando Excel...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-file-earmark-excel-fill fs-5 me-1.5"></i>
                      <span>Descargar Todas las HUs (Excel Multi-Hoja)</span>
                    </>
                  )}
                </button>

                <button
                  className="btn btn-outline-primary btn-action-pill"
                  onClick={handleCopyAll}
                  disabled={extractedStories.length === 0}
                >
                  <i className="bi bi-clipboard-check me-1.5"></i>
                  <span>Copiar Todas las HUs</span>
                </button>

                <button
                  className="btn btn-outline-secondary btn-action-pill"
                  onClick={() => setActiveTab('select')}
                >
                  <i className="bi bi-arrow-left me-1.5"></i>
                  <span>Modificar Selección</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Search inside results */}
            <div className="mt-3 pt-2.5 border-top border-subtle d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="azure-search-box" style={{ maxWidth: '420px' }}>
                <i className="bi bi-search azure-search-icon"></i>
                <input
                  type="text"
                  className="azure-search-field"
                  placeholder="Buscar en resultados (ID, palabra clave, criterio)..."
                  value={resultSearch}
                  onChange={(e) => setResultSearch(e.target.value)}
                />
                {resultSearch && (
                  <button
                    type="button"
                    className="azure-search-clear"
                    onClick={() => setResultSearch('')}
                    title="Limpiar filtro de resultados"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>

              <div className="small text-muted">
                Mostrando <strong>{filteredExtractedStories.length}</strong> de {extractedStories.length} historias
              </div>
            </div>
          </div>

          {/* Extracted Cards Stack */}
          {filteredExtractedStories.length === 0 ? (
            <div className="card panel-card p-5 text-center shadow-sm">
              <i className="bi bi-search fs-1 text-secondary opacity-50 mb-2"></i>
              <h5 className="fw-bold mb-1">No se encontraron historias con el término buscado</h5>
              <p className="text-secondary small mb-0">Prueba con otro ID o palabra clave.</p>
            </div>
          ) : (
            <div className="extracted-cards-stack">
              {filteredExtractedStories.map((story, index) => {
                const isCopied = copiedCardId === story.id;
                return (
                  <article key={story.id} className="card result-hu-card shadow-sm p-4">
                    {/* Top Row: Info and Actions */}
                    <div className="result-card-header mb-3 pb-3 border-bottom border-subtle">
                      <div className="min-w-0 flex-grow-1">
                        {/* Badges line */}
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                          <span className="story-id-tag">HU #{story.id}</span>
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-0.5">
                            Hoja #{index + 1}
                          </span>
                          <span className={`story-type-badge ${getTypeBadgeClass(story.type)}`}>
                            {story.type}
                          </span>
                          <span className={`story-state-badge ${getStateBadgeClass(story.state)}`}>
                            <span className="state-dot"></span>
                            {story.state}
                          </span>
                          <span className="story-sprint-badge">
                            <i className="bi bi-calendar3 me-1"></i>{story.sprintName}
                          </span>
                          {story.storyPoints !== null && (
                            <span className="story-points-badge">
                              {story.storyPoints} Story Points
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="result-hu-title mb-1.5">
                          {story.title}
                        </h2>

                        {/* Meta line */}
                        <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small">
                          <span>
                            <i className="bi bi-person-fill text-primary me-1"></i>
                            <strong>Responsable:</strong> {story.assignedTo}
                          </span>
                          {story.createdDate && (
                            <span>
                              <i className="bi bi-clock-history me-1"></i>
                              <strong>Fecha:</strong> {story.createdDate}
                            </span>
                          )}
                          {story.tags && (
                            <span>
                              <i className="bi bi-tags me-1"></i>
                              <strong>Tags:</strong> {story.tags}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="result-card-actions flex-shrink-0">
                        {/* Copy Single */}
                        <button
                          className={`btn btn-sm ${isCopied ? 'btn-success' : 'btn-outline-primary'} btn-action-pill`}
                          onClick={() => handleCopySingle(story)}
                          title="Copiar HU completa (Descripción y Criterios)"
                        >
                          <i className={`bi ${isCopied ? 'bi-check-lg' : 'bi-clipboard'} me-1.5`}></i>
                          <span>{isCopied ? '¡Copiado!' : 'Copiar HU'}</span>
                        </button>

                        {/* Download Single Excel */}
                        <button
                          className="btn btn-sm btn-outline-success btn-action-pill"
                          onClick={() => handleDownloadSingleExcel(story)}
                          title="Descargar esta HU en Excel individual"
                        >
                          <i className="bi bi-file-earmark-excel me-1.5"></i>
                          <span>Descargar Excel</span>
                        </button>

                        {/* External Azure Link */}
                        <a
                          href={story.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-secondary btn-action-pill"
                          title="Ver directamente en Azure DevOps"
                        >
                          <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                      </div>
                    </div>

                    {/* Dual Column Content: Description & Acceptance Criteria */}
                    <div className="row g-3">
                      {/* Description Block */}
                      <div className="col-lg-6">
                        <div className="content-display-box h-100">
                          <div className="box-header">
                            <span className="box-title text-primary">
                              <i className="bi bi-file-text-fill me-1.5"></i>
                              <span>DESCRIPCIÓN DE LA HISTORIA</span>
                            </span>
                            <button
                              className="btn btn-xs btn-link text-decoration-none text-muted p-0"
                              onClick={() => {
                                const cleanDesc = cleanAndFormatStoryText(story.description, 'description');
                                copyToClipboard(cleanDesc || '');
                                showNotification(`Descripción de HU #${story.id} copiada.`);
                              }}
                              title="Copiar descripción limpia"
                            >
                              <i className="bi bi-copy me-1"></i>Copiar
                            </button>
                          </div>

                          <div className="box-body">
                            {story.description ? (
                              <pre className="text-pre-wrap">{cleanAndFormatStoryText(story.description, 'description')}</pre>
                            ) : (
                              <span className="text-muted fst-italic small">
                                Sin descripción registrada en Azure DevOps.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Acceptance Criteria Block */}
                      <div className="col-lg-6">
                        <div className="content-display-box criteria-box h-100">
                          <div className="box-header">
                            <span className="box-title text-success">
                              <i className="bi bi-patch-check-fill me-1.5"></i>
                              <span>CRITERIOS DE ACEPTACIÓN</span>
                            </span>
                            <button
                              className="btn btn-xs btn-link text-decoration-none text-muted p-0"
                              onClick={() => {
                                const cleanCrit = cleanAndFormatStoryText(story.acceptanceCriteria, 'criteria');
                                copyToClipboard(cleanCrit || '');
                                showNotification(`Criterios de HU #${story.id} copiados.`);
                              }}
                              title="Copiar criterios de aceptación limpios"
                            >
                              <i className="bi bi-copy me-1"></i>Copiar
                            </button>
                          </div>

                          <div className="box-body">
                            {story.acceptanceCriteria ? (
                              <pre className="text-pre-wrap criteria-text">{cleanAndFormatStoryText(story.acceptanceCriteria, 'criteria')}</pre>
                            ) : (
                              <span className="text-muted fst-italic small">
                                Sin criterios de aceptación registrados en Azure DevOps.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

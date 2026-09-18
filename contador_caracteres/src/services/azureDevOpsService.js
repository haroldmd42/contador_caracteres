/**
 * Secure Azure DevOps Integration Service
 * 
 * Security Principles:
 * 1. Tokens (PAT) are passed dynamically and never stored on remote servers or databases.
 * 2. Uses client-side sessionStorage for session-only persistence.
 * 3. Strips HTML markup from Azure DevOps AcceptanceCriteria & Description fields.
 */

/** Helper to strip HTML tags from Azure DevOps HTML fields */
export function stripHtml(htmlString) {
  if (!htmlString) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = htmlString;
  let text = tmp.textContent || tmp.innerText || '';
  return text.replace(/\n\s*\n/g, '\n').trim();
}

/** Get Basic Auth Header for Azure DevOps PAT */
function getAuthHeader(pat) {
  const token = btoa(`:${pat.trim()}`);
  return {
    'Authorization': `Basic ${token}`,
    'Content-Type': 'application/json'
  };
}

/**
 * Fetch a single Work Item by ID from Azure DevOps
 */
export async function fetchWorkItemById(org, project, pat, workItemId) {
  const url = `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_apis/wit/workitems/${workItemId}?$expand=all&api-version=7.0`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeader(pat)
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('Autenticación fallida. Verifica tu PAT (Personal Access Token).');
    if (response.status === 404) throw new Error(`La Historia de Usuario con ID #${workItemId} no existe en ${org}/${project}.`);
    throw new Error(`Error en Azure DevOps (${response.status}: ${response.statusText})`);
  }

  const data = await response.json();
  const fields = data.fields || {};

  return {
    id: data.id,
    title: fields['System.Title'] || '',
    description: stripHtml(fields['System.Description'] || ''),
    acceptanceCriteria: stripHtml(fields['Microsoft.VSTS.Common.AcceptanceCriteria'] || ''),
    state: fields['System.State'] || '',
    assignedTo: fields['System.AssignedTo']?.displayName || 'Sin asignar',
    type: fields['System.WorkItemType'] || 'Work Item'
  };
}

/**
 * Fetch Teams in the Azure DevOps Project
 */
export async function fetchTeams(org, project, pat) {
  const url = `https://dev.azure.com/${encodeURIComponent(org)}/_apis/projects/${encodeURIComponent(project)}/teams?api-version=7.0`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeader(pat)
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => null);
    if (errJson && errJson.message) throw new Error(`Azure DevOps: ${errJson.message}`);
    if (response.status === 401) throw new Error('Autenticación fallida. Verifica tu PAT (Personal Access Token).');
    throw new Error(`Error al obtener equipos de Azure DevOps (${response.status})`);
  }

  const data = await response.json();
  return (data.value || []).map(team => ({
    id: team.id,
    name: team.name,
    description: team.description || ''
  }));
}

/**
 * Fetch Sprints / Iterations for a specific Team in Azure DevOps
 */
export async function fetchTeamIterations(org, project, teamIdOrName, pat) {
  const url = `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/${encodeURIComponent(teamIdOrName)}/_apis/work/teamsettings/iterations?api-version=7.0`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeader(pat)
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => null);
    if (errJson && errJson.message) throw new Error(`Azure DevOps: ${errJson.message}`);
    throw new Error(`Error al obtener Sprints/Iteraciones del equipo (${response.status})`);
  }

  const data = await response.json();
  return (data.value || []).map(item => ({
    id: item.id,
    name: item.name,
    path: item.path,
    startDate: item.attributes?.startDate ? new Date(item.attributes.startDate).toLocaleDateString() : null,
    finishDate: item.attributes?.finishDate ? new Date(item.attributes.finishDate).toLocaleDateString() : null,
    timeFrame: item.attributes?.timeFrame || 'past'
  }));
}

/**
 * Query Work Items by Sprint / Iteration Path
 */
export async function queryWorkItemsByIterationPath(org, project, iterationPath, pat) {
  const wiqlUrl = `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_apis/wit/wiql?api-version=7.0`;
  const escapedPath = iterationPath.replace(/'/g, "''");
  const wiqlBody = {
    query: `SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType] FROM WorkItems WHERE [System.TeamProject] = '${project.trim()}' AND [System.IterationPath] UNDER '${escapedPath}' AND [System.WorkItemType] IN ('Product Backlog Item', 'User Story', 'Requirement', 'Feature') ORDER BY [System.ChangedDate] DESC`
  };

  const response = await fetch(wiqlUrl, {
    method: 'POST',
    headers: getAuthHeader(pat),
    body: JSON.stringify(wiqlBody)
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => null);
    if (errJson && errJson.message) throw new Error(`Azure DevOps: ${errJson.message}`);
    throw new Error(`Error al consultar elementos del Sprint (${response.status})`);
  }

  const wiqlData = await response.json();
  const workItems = (wiqlData.workItems || []).slice(0, 50);

  if (workItems.length === 0) return [];

  const ids = workItems.map(item => item.id).join(',');
  const detailsUrl = `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_apis/wit/workitems?ids=${ids}&$expand=all&api-version=7.0`;

  const detailsResponse = await fetch(detailsUrl, {
    method: 'GET',
    headers: getAuthHeader(pat)
  });

  if (!detailsResponse.ok) throw new Error('Error al obtener detalles de los Work Items del Sprint.');

  const detailsData = await detailsResponse.json();
  return (detailsData.value || []).map(item => ({
    id: item.id,
    title: item.fields['System.Title'] || '',
    description: stripHtml(item.fields['System.Description'] || ''),
    acceptanceCriteria: stripHtml(item.fields['Microsoft.VSTS.Common.AcceptanceCriteria'] || ''),
    state: item.fields['System.State'] || '',
    type: item.fields['System.WorkItemType'] || 'User Story'
  }));
}

/**
 * Query recent active User Stories from Azure DevOps using WIQL
 */
export async function queryRecentUserStories(org, project, pat) {
  const wiqlUrl = `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_apis/wit/wiql?api-version=7.0`;
  const wiqlBody = {
    query: `SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType] FROM WorkItems WHERE [System.TeamProject] = '${project.trim()}' AND [System.WorkItemType] IN ('Product Backlog Item', 'User Story', 'Requirement', 'Feature') AND [System.State] NOT IN ('Closed', 'Removed') AND [System.ChangedDate] >= @today - 90 ORDER BY [System.ChangedDate] DESC`
  };

  const response = await fetch(wiqlUrl, {
    method: 'POST',
    headers: getAuthHeader(pat),
    body: JSON.stringify(wiqlBody)
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => null);
    if (errJson && errJson.message) throw new Error(`Azure DevOps: ${errJson.message}`);
    if (response.status === 401) throw new Error('Autenticación fallida en Azure DevOps. Verifica tu PAT (Personal Access Token).');
    throw new Error(`Error al consultar Azure DevOps (${response.status})`);
  }

  const wiqlData = await response.json();
  const workItems = (wiqlData.workItems || []).slice(0, 30);

  if (workItems.length === 0) return [];

  const ids = workItems.map(item => item.id).join(',');
  const detailsUrl = `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_apis/wit/workitems?ids=${ids}&$expand=all&api-version=7.0`;

  const detailsResponse = await fetch(detailsUrl, {
    method: 'GET',
    headers: getAuthHeader(pat)
  });

  if (!detailsResponse.ok) throw new Error('Error al obtener detalles de las Historias de Usuario.');

  const detailsData = await detailsResponse.json();
  return (detailsData.value || []).map(item => ({
    id: item.id,
    title: item.fields['System.Title'] || '',
    description: stripHtml(item.fields['System.Description'] || ''),
    acceptanceCriteria: stripHtml(item.fields['Microsoft.VSTS.Common.AcceptanceCriteria'] || ''),
    state: item.fields['System.State'] || '',
    type: item.fields['System.WorkItemType'] || 'User Story'
  }));
}

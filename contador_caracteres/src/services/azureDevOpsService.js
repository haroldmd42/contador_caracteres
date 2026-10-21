/**
 * Secure Azure DevOps Integration Service
 * 
 * Security Principles:
 * 1. Tokens (PAT) are passed dynamically and never stored on remote servers or databases.
 * 2. Uses client-side sessionStorage for session-only persistence.
 * 3. Strips and formats HTML markup from Azure DevOps AcceptanceCriteria & Description fields.
 */

/**
 * Clean and format Description or Acceptance Criteria text:
 * 1. Strips HTML markup cleanly without generating duplicate blank lines.
 * 2. Removes redundant/unnecessary header labels (e.g. "Criterios de Aceptación", "Descripción:").
 * 3. Normalizes Gherkin BDD scenarios (Escenario X, Dado que, Cuando, Entonces, Y) into clean,
 *    cohesive blocks without awkward blank lines between steps.
 * 4. Ensures clean single blank lines between distinct scenarios or paragraphs.
 * 5. Replaces tabs, non-breaking spaces, and invisible control characters.
 *
 * @param {string} htmlOrText - Raw HTML or text from Azure DevOps
 * @param {'criteria'|'description'|'general'} type - Type of field being cleaned
 */
export function cleanAndFormatStoryText(htmlOrText, type = 'general') {
  if (!htmlOrText) return '';
  let str = String(htmlOrText);

  // 1. Pre-process HTML tags into clean text markers
  // Replace line breaks and paragraph ends with newlines
  str = str.replace(/<br\s*\/?>/gi, '\n');
  
  // Format list items cleanly
  str = str.replace(/<li[^>]*>/gi, '\n• ');
  str = str.replace(/<\/li>/gi, '');

  // Format table rows and cells cleanly
  str = str.replace(/<\/tr>/gi, '\n');
  str = str.replace(/<\/(td|th)>/gi, ' ');
  str = str.replace(/<tr[^>]*>/gi, '\n');

  // Paragraph and div boundaries
  str = str.replace(/<\/(p|div|h[1-6])>/gi, '\n');
  str = str.replace(/<(p|div|h[1-6])[^>]*>/gi, '\n');

  // Decode common HTML entities
  str = str.replace(/&nbsp;/gi, ' ');
  str = str.replace(/&amp;/gi, '&');
  str = str.replace(/&lt;/gi, '<');
  str = str.replace(/&gt;/gi, '>');
  str = str.replace(/&quot;/gi, '"');
  str = str.replace(/&#39;/gi, "'");

  // Strip remaining HTML tags
  str = str.replace(/<[^>]+>/g, ' ');

  // 2. Decode invisible Unicode spaces and control chars
  str = str.replace(/[\u200B\u200C\u200D\uFEFF\u00A0]/g, ' ');
  str = str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  str = str.replace(/\t/g, '  ');

  // 3. Extract and normalize lines
  let rawLines = str
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(line => line.length > 0);

  // 4. Remove redundant/unnecessary header prefixes at the start
  if (type === 'criteria') {
    while (rawLines.length > 0) {
      const first = rawLines[0].toLowerCase();
      if (
        /^(criterios?\s*(de\s*aceptaci[oó]n)?|acceptance\s*criteria|ac)\s*[:.-]*$/i.test(first) ||
        /^criterios?\s*de\s*aceptaci[oó]n\s*[:.-]*$/i.test(first)
      ) {
        rawLines.shift();
      } else {
        break;
      }
    }
  } else if (type === 'description') {
    while (rawLines.length > 0) {
      const first = rawLines[0].toLowerCase();
      if (
        /^(descripci[oó]n|description|historia\s*de\s*usuario|user\s*story|hu|detalles?)\s*[:.-]*$/i.test(first)
      ) {
        rawLines.shift();
      } else {
        break;
      }
    }
  }

  // 5. Structure into cohesive, beautifully spaced paragraphs & scenarios
  const formattedLines = [];
  const scenarioRegex = /^(escenario|scenario)\s*\d*\s*[:.-]/i;
  const isGherkinOrBullet = (line) => {
    return /^(dado\s+que|given|cuando|when|entonces|then|y\s+|and\s+|pero\s+|but\s+|•|\*|-)\b/i.test(line);
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    
    // Check if line contains "Escenario X:" embedded inside another sentence (fix for glued scenarios)
    const embeddedScenario = line.match(/(.+?)\s+((?:Escenario|Scenario)\s*\d*\s*[:.-].*)/i);
    if (embeddedScenario) {
      rawLines.splice(i, 1, embeddedScenario[1].trim(), embeddedScenario[2].trim());
      i--;
      continue;
    }

    if (scenarioRegex.test(line)) {
      // Add a clean blank line before scenario if it's not the very first line
      if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] !== '') {
        formattedLines.push('');
      }
      formattedLines.push(line);
    } else if (isGherkinOrBullet(line)) {
      // Format bullets with clean bullet symbol
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        const cleanBullet = line.replace(/^[•\s\-\*]+/, '').trim();
        formattedLines.push(`• ${cleanBullet}`);
      } else {
        formattedLines.push(line);
      }
    } else {
      // Standard line
      formattedLines.push(line);
    }
  }

  // Join lines and normalize empty lines (max 1 empty line between blocks)
  return formattedLines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Helper to clean and format HTML tags into readable text preserving linebreaks and bullets */
export function formatHtmlToText(htmlString, type = 'general') {
  return cleanAndFormatStoryText(htmlString, type);
}

/** Legacy alias for backward compatibility */
export function stripHtml(htmlString, type = 'general') {
  return cleanAndFormatStoryText(htmlString, type);
}

/** Get Basic Auth Header for Azure DevOps PAT */
export function getAuthHeader(pat) {
  const token = btoa(`:${pat.trim()}`);
  return {
    'Authorization': `Basic ${token}`,
    'Content-Type': 'application/json'
  };
}

/**
 * Fetch a single Work Item by ID from Azure DevOps with rich metadata
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
  const iteration = fields['System.IterationPath'] || '';
  const sprintName = iteration.split('\\').pop() || iteration || 'Sin Sprint';

  return {
    id: data.id,
    title: fields['System.Title'] || '',
    description: formatHtmlToText(fields['System.Description'] || '', 'description'),
    rawDescription: fields['System.Description'] || '',
    acceptanceCriteria: formatHtmlToText(
      fields['Microsoft.VSTS.Common.AcceptanceCriteria'] ||
      fields['Custom.AcceptanceCriteria'] ||
      fields['Microsoft.VSTS.Common.Acceptance_Criteria'] ||
      '',
      'criteria'
    ),
    rawAcceptanceCriteria: fields['Microsoft.VSTS.Common.AcceptanceCriteria'] || fields['Custom.AcceptanceCriteria'] || '',
    state: fields['System.State'] || 'New',
    assignedTo: fields['System.AssignedTo']?.displayName || 'Sin asignar',
    type: fields['System.WorkItemType'] || 'User Story',
    iterationPath: iteration,
    sprintName,
    storyPoints: fields['Microsoft.VSTS.Scheduling.StoryPoints'] || fields['Microsoft.VSTS.Scheduling.Effort'] || null,
    priority: fields['Microsoft.VSTS.Common.Priority'] || null,
    tags: fields['System.Tags'] || '',
    createdDate: fields['System.CreatedDate'] ? new Date(fields['System.CreatedDate']).toLocaleDateString() : '',
    url: data._links?.html?.href || `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_workitems/edit/${data.id}`
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
 * Query Work Items across ONE or MULTIPLE Iterations/Sprints
 */
export async function queryWorkItemsByMultipleIterations(org, project, iterationPaths, pat) {
  if (!iterationPaths || iterationPaths.length === 0) return [];

  // Construct WIQL query with OR conditions for all selected iterations
  const iterationClauses = iterationPaths
    .map(p => `[System.IterationPath] UNDER '${p.replace(/'/g, "''")}'`)
    .join(' OR ');

  const wiqlUrl = `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_apis/wit/wiql?api-version=7.0`;
  const wiqlBody = {
    query: `SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType], [System.IterationPath] FROM WorkItems WHERE [System.TeamProject] = '${project.trim()}' AND (${iterationClauses}) AND [System.WorkItemType] IN ('Product Backlog Item', 'User Story', 'Requirement', 'Feature', 'Bug', 'Issue', 'Epic') ORDER BY [System.IterationPath] ASC, [System.Id] ASC`
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
    throw new Error(`Error al consultar elementos de los Sprints seleccionados (${response.status})`);
  }

  const wiqlData = await response.json();
  const workItems = wiqlData.workItems || [];
  if (workItems.length === 0) return [];

  // Azure DevOps workitems batch API supports max 200 IDs per request
  const chunkSize = 200;
  const detailedItems = [];

  for (let i = 0; i < workItems.length; i += chunkSize) {
    const chunk = workItems.slice(i, i + chunkSize);
    const ids = chunk.map(item => item.id).join(',');
    const detailsUrl = `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_apis/wit/workitems?ids=${ids}&$expand=all&api-version=7.0`;

    const detailsResponse = await fetch(detailsUrl, {
      method: 'GET',
      headers: getAuthHeader(pat)
    });

    if (!detailsResponse.ok) {
      throw new Error('Error al obtener los detalles completos de las Historias de Usuario.');
    }

    const detailsData = await detailsResponse.json();
    const items = (detailsData.value || []).map(item => {
      const fields = item.fields || {};
      const iteration = fields['System.IterationPath'] || '';
      const sprintName = iteration.split('\\').pop() || iteration || 'Sprint';

      const acceptanceCriteria = formatHtmlToText(
        fields['Microsoft.VSTS.Common.AcceptanceCriteria'] ||
        fields['Custom.AcceptanceCriteria'] ||
        fields['Microsoft.VSTS.Common.Acceptance_Criteria'] ||
        '',
        'criteria'
      );

      const description = formatHtmlToText(fields['System.Description'] || '', 'description');

      return {
        id: item.id,
        title: fields['System.Title'] || '',
        description,
        acceptanceCriteria,
        rawDescription: fields['System.Description'] || '',
        rawAcceptanceCriteria: fields['Microsoft.VSTS.Common.AcceptanceCriteria'] || fields['Custom.AcceptanceCriteria'] || '',
        state: fields['System.State'] || 'New',
        type: fields['System.WorkItemType'] || 'User Story',
        assignedTo: fields['System.AssignedTo']?.displayName || 'Sin asignar',
        iterationPath: iteration,
        sprintName,
        storyPoints: fields['Microsoft.VSTS.Scheduling.StoryPoints'] || fields['Microsoft.VSTS.Scheduling.Effort'] || null,
        priority: fields['Microsoft.VSTS.Common.Priority'] || null,
        tags: fields['System.Tags'] || '',
        createdDate: fields['System.CreatedDate'] ? new Date(fields['System.CreatedDate']).toLocaleDateString() : '',
        url: item._links?.html?.href || `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_workitems/edit/${item.id}`
      };
    });

    detailedItems.push(...items);
  }

  return detailedItems;
}

/**
 * Single sprint wrapper for backward compatibility
 */
export async function queryWorkItemsByIterationPath(org, project, iterationPath, pat) {
  return queryWorkItemsByMultipleIterations(org, project, [iterationPath], pat);
}

/**
 * Query recent active User Stories from Azure DevOps using WIQL
 */
export async function queryRecentUserStories(org, project, pat) {
  const wiqlUrl = `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_apis/wit/wiql?api-version=7.0`;
  const wiqlBody = {
    query: `SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType] FROM WorkItems WHERE [System.TeamProject] = '${project.trim()}' AND [System.WorkItemType] IN ('Product Backlog Item', 'User Story', 'Requirement', 'Feature', 'Bug', 'Issue') AND [System.State] NOT IN ('Closed', 'Removed') AND [System.ChangedDate] >= @today - 90 ORDER BY [System.ChangedDate] DESC`
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
  const workItems = (wiqlData.workItems || []).slice(0, 50);

  if (workItems.length === 0) return [];

  const ids = workItems.map(item => item.id).join(',');
  const detailsUrl = `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_apis/wit/workitems?ids=${ids}&$expand=all&api-version=7.0`;

  const detailsResponse = await fetch(detailsUrl, {
    method: 'GET',
    headers: getAuthHeader(pat)
  });

  if (!detailsResponse.ok) throw new Error('Error al obtener detalles de las Historias de Usuario.');

  const detailsData = await detailsResponse.json();
  return (detailsData.value || []).map(item => {
    const fields = item.fields || {};
    const iteration = fields['System.IterationPath'] || '';
    const sprintName = iteration.split('\\').pop() || iteration || 'Sprint';

    return {
      id: item.id,
      title: fields['System.Title'] || '',
      description: formatHtmlToText(fields['System.Description'] || '', 'description'),
      acceptanceCriteria: formatHtmlToText(
        fields['Microsoft.VSTS.Common.AcceptanceCriteria'] ||
        fields['Custom.AcceptanceCriteria'] ||
        fields['Microsoft.VSTS.Common.Acceptance_Criteria'] ||
        '',
        'criteria'
      ),
      rawDescription: fields['System.Description'] || '',
      rawAcceptanceCriteria: fields['Microsoft.VSTS.Common.AcceptanceCriteria'] || fields['Custom.AcceptanceCriteria'] || '',
      state: fields['System.State'] || 'New',
      type: fields['System.WorkItemType'] || 'User Story',
      assignedTo: fields['System.AssignedTo']?.displayName || 'Sin asignar',
      iterationPath: iteration,
      sprintName,
      storyPoints: fields['Microsoft.VSTS.Scheduling.StoryPoints'] || null,
      createdDate: fields['System.CreatedDate'] ? new Date(fields['System.CreatedDate']).toLocaleDateString() : '',
      url: item._links?.html?.href || `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_workitems/edit/${item.id}`
    };
  });
}

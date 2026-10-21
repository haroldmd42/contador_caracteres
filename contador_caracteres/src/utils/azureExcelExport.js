import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { cleanAndFormatStoryText } from '../services/azureDevOpsService';

/**
 * Sanitize a string so it can be safely used as an Excel sheet name.
 * Excel sheet names are strictly capped at 31 chars and cannot contain: \ / ? * [ ] :
 */
function sanitizeSheetName(name, fallback = 'Hoja') {
  if (!name) return fallback;
  const clean = String(name).replace(/[\\/?*[\]:]/g, '_').trim();
  return clean.slice(0, 31) || fallback;
}

/**
 * Sanitize a string for safe filesystem filename
 */
function sanitizeFilename(name, fallback = 'archivo') {
  if (!name) return fallback;
  return String(name)
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 50) || fallback;
}

/** Standard border definition for corporate Excel sheets */
const thinBorder = {
  top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
};

/**
 * Export a single User Story to a beautifully formatted Excel document
 * @param {Object} hu - The User Story data
 * @param {string} project - Project name
 * @param {string} org - Organization name
 */
export async function exportSingleHUToExcel(hu, project = 'Azure DevOps', org = '') {
  if (!hu) return;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'QATOOLS - Azure Extractor';
  workbook.created = new Date();

  const sheetName = sanitizeSheetName(`HU ${hu.id}`, 'Detalle HU');
  const ws = workbook.addWorksheet(sheetName, {
    views: [{ showGridLines: true }]
  });

  // Setup Column Widths
  ws.columns = [
    { key: 'colA', width: 14 },
    { key: 'colB', width: 36 },
    { key: 'colC', width: 14 },
    { key: 'colD', width: 18 },
    { key: 'colE', width: 24 },
    { key: 'colF', width: 26 },
  ];

  let r = 1;

  // 1. Title Banner
  ws.mergeCells(`A${r}:F${r}`);
  const titleCell = ws.getCell(`A${r}`);
  titleCell.value = `[HU #${hu.id}] ${hu.title || 'Historia de Usuario'}`;
  titleCell.font = { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0078D4' } }; // Azure Blue
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(r).height = 36;
  ['A', 'B', 'C', 'D', 'E', 'F'].forEach(c => ws.getCell(`${c}${r}`).border = thinBorder);
  r += 2;

  // 2. Metadata Grid
  const metaRows = [
    [
      { label: 'ID Work Item', val: `#${hu.id}` },
      { label: 'Estado', val: hu.state || 'N/A' }
    ],
    [
      { label: 'Tipo', val: hu.type || 'User Story' },
      { label: 'Sprint', val: hu.sprintName || hu.iterationPath || 'N/A' }
    ],
    [
      { label: 'Asignado a', val: hu.assignedTo || 'Sin asignar' },
      { label: 'Puntos / Story Points', val: hu.storyPoints !== null ? String(hu.storyPoints) : 'N/A' }
    ],
    [
      { label: 'Proyecto', val: `${project}${org ? ` (${org})` : ''}` },
      { label: 'Fecha Creación', val: hu.createdDate || 'N/A' }
    ],
    [
      { label: 'Enlace Azure', val: hu.url ? { text: 'Abrir en Azure DevOps', hyperlink: hu.url } : 'N/A' },
      { label: 'Etiquetas (Tags)', val: hu.tags || 'Sin etiquetas' }
    ]
  ];

  metaRows.forEach(item => {
    const row = ws.getRow(r);
    row.height = 24;

    // Col A & B
    const cellA = ws.getCell(`A${r}`);
    cellA.value = item[0].label;
    cellA.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1E293B' } };
    cellA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    cellA.alignment = { horizontal: 'left', vertical: 'middle' };
    cellA.border = thinBorder;

    const cellB = ws.getCell(`B${r}`);
    cellB.value = item[0].val;
    cellB.font = { name: 'Calibri', size: 10, color: { argb: typeof item[0].val === 'object' ? 'FF0066CC' : 'FF0F172A' }, underline: typeof item[0].val === 'object' };
    cellB.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    cellB.border = thinBorder;

    // Col D & E:F (merged E and F for more space)
    const cellD = ws.getCell(`D${r}`);
    cellD.value = item[1].label;
    cellD.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1E293B' } };
    cellD.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    cellD.alignment = { horizontal: 'left', vertical: 'middle' };
    cellD.border = thinBorder;

    ws.mergeCells(`E${r}:F${r}`);
    const cellE = ws.getCell(`E${r}`);
    cellE.value = item[1].val;
    cellE.font = { name: 'Calibri', size: 10, color: { argb: 'FF0F172A' } };
    cellE.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    ['E', 'F'].forEach(c => ws.getCell(`${c}${r}`).border = thinBorder);

    r++;
  });

  r++; // Spacer

  // 3. Descripción Section Header
  ws.mergeCells(`A${r}:F${r}`);
  const descHead = ws.getCell(`A${r}`);
  descHead.value = '1. DESCRIPCIÓN DE LA HISTORIA DE USUARIO';
  descHead.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  descHead.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } }; // Royal Blue
  descHead.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  ws.getRow(r).height = 26;
  ['A', 'B', 'C', 'D', 'E', 'F'].forEach(c => ws.getCell(`${c}${r}`).border = thinBorder);
  r++;

  // 4. Descripción Content Box
  ws.mergeCells(`A${r}:F${r}`);
  const descCell = ws.getCell(`A${r}`);
  const descText = cleanAndFormatStoryText(hu.description, 'description') || 'Sin descripción registrada en Azure DevOps.';
  descCell.value = descText;
  descCell.font = { name: 'Calibri', size: 10, color: { argb: 'FF1E293B' } };
  descCell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
  
  // Calculate dynamic height based on lines
  const descLines = descText.split('\n').length;
  ws.getRow(r).height = Math.min(409, Math.max(45, descLines * 16 + 14));
  ['A', 'B', 'C', 'D', 'E', 'F'].forEach(c => ws.getCell(`${c}${r}`).border = thinBorder);
  ws.getRow(r + 1).height = 14;
  r += 2; // Spacer

  // 5. Criterios de Aceptación Section Header
  ws.mergeCells(`A${r}:F${r}`);
  const critHead = ws.getCell(`A${r}`);
  critHead.value = '2. CRITERIOS DE ACEPTACIÓN';
  critHead.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  critHead.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } }; // Darker Blue
  critHead.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  ws.getRow(r).height = 26;
  ['A', 'B', 'C', 'D', 'E', 'F'].forEach(c => ws.getCell(`${c}${r}`).border = thinBorder);
  r++;

  // 6. Criterios Content Box
  ws.mergeCells(`A${r}:F${r}`);
  const critCell = ws.getCell(`A${r}`);
  const critText = cleanAndFormatStoryText(hu.acceptanceCriteria, 'criteria') || 'Sin criterios de aceptación registrados en Azure DevOps.';
  critCell.value = critText;
  critCell.font = { name: 'Calibri', size: 10, color: { argb: 'FF1E293B' } };
  critCell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
  const critLines = critText.split('\n').length;
  ws.getRow(r).height = Math.min(409, Math.max(50, critLines * 16 + 16));
  ['A', 'B', 'C', 'D', 'E', 'F'].forEach(c => ws.getCell(`${c}${r}`).border = thinBorder);
  ws.getRow(r + 1).height = 14;
  r += 2; // Spacer

  // 7. Matriz QA Checklist Section Header
  ws.mergeCells(`A${r}:F${r}`);
  const qaHead = ws.getCell(`A${r}`);
  qaHead.value = '3. MATRIZ / CHECKLIST DE PRUEBAS DE CALIDAD (QA)';
  qaHead.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  qaHead.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } }; // Emerald Green
  qaHead.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  ws.getRow(r).height = 24;
  ['A', 'B', 'C', 'D', 'E', 'F'].forEach(c => ws.getCell(`${c}${r}`).border = thinBorder);
  r++;

  // QA Table Header
  const qaHeaders = ['N°', 'Criterio / Escenario de Prueba', 'Pasos / Datos de Prueba', 'Resultado Esperado', 'Estado (Pasa / Falla)', 'Observaciones / Bugs'];
  const qaRow = ws.getRow(r);
  qaRow.height = 24;
  qaHeaders.forEach((h, idx) => {
    const cell = qaRow.getCell(idx + 1);
    cell.value = h;
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1E293B' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = thinBorder;
  });
  r++;

  // Add 4 template test case rows ready for tester to fill
  for (let i = 1; i <= 4; i++) {
    const row = ws.getRow(r);
    row.height = 28;
    const cellNum = row.getCell(1);
    cellNum.value = i;
    cellNum.alignment = { horizontal: 'center', vertical: 'middle' };
    cellNum.font = { name: 'Calibri', size: 10 };
    cellNum.border = thinBorder;

    for (let c = 2; c <= 6; c++) {
      const cell = row.getCell(c);
      cell.value = '';
      cell.font = { name: 'Calibri', size: 10 };
      cell.border = thinBorder;
      if (c === 5) cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
    r++;
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `HU_${hu.id}_${sanitizeFilename(hu.title)}.xlsx`;
  saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename);
}

/**
 * Export ALL extracted User Stories into a single Excel workbook.
 * - Sheet 1: "0. Resumen" (Executive Index of all stories with hyperlinks)
 * - Sheets 2..N: "1. HU <id>", "2. HU <id>" (Numbered per HU, styled cards)
 * 
 * @param {Array} huList - Array of processed User Story objects
 * @param {string} project - Azure DevOps Project name
 * @param {string} org - Azure DevOps Organization name
 * @param {Array} selectedSprints - List of selected sprint names
 */
export async function exportMultipleHUsToExcel(huList, project = 'Azure DevOps', org = '', selectedSprints = []) {
  if (!huList || huList.length === 0) {
    alert('No hay Historias de Usuario para exportar.');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'QATOOLS - Azure Extractor';
  workbook.created = new Date();

  // =========================================================================
  // SHEET 1: RESUMEN EJECUTIVO / ÍNDICE DE HISTORIAS
  // =========================================================================
  const summarySheetName = '0. Resumen';
  const summaryWs = workbook.addWorksheet(summarySheetName, {
    views: [{ showGridLines: true, state: 'frozen', ySplit: 5 }]
  });

  summaryWs.columns = [
    { key: 'num', width: 7 },
    { key: 'id', width: 13 },
    { key: 'title', width: 48 },
    { key: 'sprint', width: 22 },
    { key: 'type', width: 18 },
    { key: 'state', width: 14 },
    { key: 'assigned', width: 22 },
    { key: 'link', width: 20 },
  ];

  // 1. Title Banner
  summaryWs.mergeCells('A1:H1');
  const sumTitle = summaryWs.getCell('A1');
  sumTitle.value = 'CONSOLIDADO DE HISTORIAS DE USUARIO - AZURE DEVOPS';
  sumTitle.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  sumTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }; // Dark Slate
  sumTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  summaryWs.getRow(1).height = 36;
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(c => summaryWs.getCell(`${c}1`).border = thinBorder);

  // 2. Info Row 1
  summaryWs.mergeCells('A2:D2');
  const orgProjCell = summaryWs.getCell('A2');
  orgProjCell.value = `Organización: ${org || 'N/A'}  |  Proyecto: ${project || 'N/A'}`;
  orgProjCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF334155' } };
  orgProjCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
  orgProjCell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  ['A', 'B', 'C', 'D'].forEach(c => summaryWs.getCell(`${c}2`).border = thinBorder);

  summaryWs.mergeCells('E2:H2');
  const dateCell = summaryWs.getCell('E2');
  dateCell.value = `Fecha de Extracción: ${new Date().toLocaleString()}`;
  dateCell.font = { name: 'Calibri', size: 10, color: { argb: 'FF64748B' } };
  dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
  dateCell.alignment = { horizontal: 'right', vertical: 'middle' };
  ['E', 'F', 'G', 'H'].forEach(c => summaryWs.getCell(`${c}2`).border = thinBorder);
  summaryWs.getRow(2).height = 22;

  // 3. Info Row 2
  summaryWs.mergeCells('A3:D3');
  const sprintCell = summaryWs.getCell('A3');
  const sprintDisplay = selectedSprints.length > 0 ? selectedSprints.join(', ') : 'Varios Sprints';
  sprintCell.value = `Sprints Involucrados: ${sprintDisplay}`;
  sprintCell.font = { name: 'Calibri', size: 10, color: { argb: 'FF334155' } };
  sprintCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
  sprintCell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  ['A', 'B', 'C', 'D'].forEach(c => summaryWs.getCell(`${c}3`).border = thinBorder);

  summaryWs.mergeCells('E3:H3');
  const countCell = summaryWs.getCell('E3');
  countCell.value = `Total Historias Procesadas: ${huList.length}`;
  countCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0078D4' } };
  countCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
  countCell.alignment = { horizontal: 'right', vertical: 'middle' };
  ['E', 'F', 'G', 'H'].forEach(c => summaryWs.getCell(`${c}3`).border = thinBorder);
  summaryWs.getRow(3).height = 22;

  // 4. Spacer
  summaryWs.getRow(4).height = 10;

  // 5. Table Headers (Row 5)
  const sumHeaders = ['N°', 'ID Work Item', 'Título de la Historia', 'Sprint', 'Tipo', 'Estado', 'Asignado a', 'Detalle en Archivo'];
  const sumHeaderRow = summaryWs.getRow(5);
  sumHeaderRow.height = 28;
  sumHeaders.forEach((h, idx) => {
    const cell = sumHeaderRow.getCell(idx + 1);
    cell.value = h;
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } }; // Corporate Steel Navy
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = thinBorder;
  });

  // Track sheet names for cross-linking
  const sheetNameList = [];

  // =========================================================================
  // SHEETS 2..N: NUMBERED SHEETS FOR EACH HU
  // =========================================================================
  huList.forEach((hu, index) => {
    const huNumber = index + 1;
    // Sheet name strictly format: "<number>. HU <id>" (capped to 31 chars)
    const rawSheetName = `${huNumber}. HU ${hu.id}`;
    const huSheetName = sanitizeSheetName(rawSheetName, `HU_${huNumber}`);
    sheetNameList.push(huSheetName);

    const ws = workbook.addWorksheet(huSheetName, {
      views: [{ showGridLines: true }]
    });

    ws.columns = [
      { key: 'colA', width: 14 },
      { key: 'colB', width: 36 },
      { key: 'colC', width: 14 },
      { key: 'colD', width: 18 },
      { key: 'colE', width: 24 },
      { key: 'colF', width: 26 },
    ];

    let r = 1;

    // Row 1: Back to Index link
    const backCell = ws.getCell('A1');
    backCell.value = { text: '⬅ Volver al Índice General de Historias', hyperlink: `#'${summarySheetName}'!A1` };
    backCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0066CC' }, underline: true };
    backCell.alignment = { horizontal: 'left', vertical: 'middle' };
    ws.getRow(1).height = 22;
    r++;

    // Row 2: Title Banner
    ws.mergeCells(`A${r}:F${r}`);
    const huTitleCell = ws.getCell(`A${r}`);
    huTitleCell.value = `[HU #${hu.id}] ${hu.title || 'Historia de Usuario'}`;
    huTitleCell.font = { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
    huTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0078D4' } }; // Azure Blue
    huTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getRow(r).height = 36;
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(c => ws.getCell(`${c}${r}`).border = thinBorder);
    r += 2; // Spacer

    // Metadata Grid
    const metadata = [
      [
        { label: 'N° de Hoja / Orden', val: `#${huNumber} de ${huList.length}` },
        { label: 'Estado', val: hu.state || 'N/A' }
      ],
      [
        { label: 'ID Work Item', val: `#${hu.id}` },
        { label: 'Sprint', val: hu.sprintName || hu.iterationPath || 'N/A' }
      ],
      [
        { label: 'Tipo de Item', val: hu.type || 'User Story' },
        { label: 'Puntos / Story Points', val: hu.storyPoints !== null ? String(hu.storyPoints) : 'N/A' }
      ],
      [
        { label: 'Asignado a', val: hu.assignedTo || 'Sin asignar' },
        { label: 'Fecha Creación', val: hu.createdDate || 'N/A' }
      ],
      [
        { label: 'Proyecto Azure', val: `${project}${org ? ` (${org})` : ''}` },
        { label: 'Enlace Directo', val: hu.url ? { text: 'Abrir en Azure DevOps', hyperlink: hu.url } : 'N/A' }
      ]
    ];

    metadata.forEach(item => {
      const row = ws.getRow(r);
      row.height = 24;

      // Col A & B
      const cA = ws.getCell(`A${r}`);
      cA.value = item[0].label;
      cA.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1E293B' } };
      cA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
      cA.alignment = { horizontal: 'left', vertical: 'middle' };
      cA.border = thinBorder;

      const cB = ws.getCell(`B${r}`);
      cB.value = item[0].val;
      cB.font = { name: 'Calibri', size: 10, color: { argb: 'FF0F172A' } };
      cB.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      cB.border = thinBorder;

      // Col D & E:F
      const cD = ws.getCell(`D${r}`);
      cD.value = item[1].label;
      cD.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1E293B' } };
      cD.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
      cD.alignment = { horizontal: 'left', vertical: 'middle' };
      cD.border = thinBorder;

      ws.mergeCells(`E${r}:F${r}`);
      const cE = ws.getCell(`E${r}`);
      cE.value = item[1].val;
      cE.font = { name: 'Calibri', size: 10, color: { argb: typeof item[1].val === 'object' ? 'FF0066CC' : 'FF0F172A' }, underline: typeof item[1].val === 'object' };
      cE.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      ['E', 'F'].forEach(col => ws.getCell(`${col}${r}`).border = thinBorder);

      r++;
    });

    r++; // Spacer

    // Descripción Section
    ws.mergeCells(`A${r}:F${r}`);
    const dHead = ws.getCell(`A${r}`);
    dHead.value = '1. DESCRIPCIÓN DE LA HISTORIA DE USUARIO';
    dHead.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    dHead.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } }; // Royal Blue
    dHead.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
    ws.getRow(r).height = 26;
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => ws.getCell(`${col}${r}`).border = thinBorder);
    r++;

    ws.mergeCells(`A${r}:F${r}`);
    const dBox = ws.getCell(`A${r}`);
    const dText = cleanAndFormatStoryText(hu.description, 'description') || 'Sin descripción registrada en Azure DevOps.';
    dBox.value = dText;
    dBox.font = { name: 'Calibri', size: 10, color: { argb: 'FF1E293B' } };
    dBox.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    const dLines = dText.split('\n').length;
    ws.getRow(r).height = Math.min(409, Math.max(45, dLines * 16 + 14));
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => ws.getCell(`${col}${r}`).border = thinBorder);
    ws.getRow(r + 1).height = 14;
    r += 2; // Spacer

    // Criterios de Aceptación Section
    ws.mergeCells(`A${r}:F${r}`);
    const cHead = ws.getCell(`A${r}`);
    cHead.value = '2. CRITERIOS DE ACEPTACIÓN';
    cHead.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cHead.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } }; // Navy Blue
    cHead.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
    ws.getRow(r).height = 26;
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => ws.getCell(`${col}${r}`).border = thinBorder);
    r++;

    ws.mergeCells(`A${r}:F${r}`);
    const cBox = ws.getCell(`A${r}`);
    const cText = cleanAndFormatStoryText(hu.acceptanceCriteria, 'criteria') || 'Sin criterios de aceptación registrados en Azure DevOps.';
    cBox.value = cText;
    cBox.font = { name: 'Calibri', size: 10, color: { argb: 'FF1E293B' } };
    cBox.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    const cLines = cText.split('\n').length;
    ws.getRow(r).height = Math.min(409, Math.max(50, cLines * 16 + 16));
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => ws.getCell(`${col}${r}`).border = thinBorder);
    ws.getRow(r + 1).height = 14;
    r += 2; // Spacer

    // QA Checklist Section
    ws.mergeCells(`A${r}:F${r}`);
    const qHead = ws.getCell(`A${r}`);
    qHead.value = '3. MATRIZ / CHECKLIST DE PRUEBAS DE CALIDAD (QA)';
    qHead.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    qHead.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } }; // Emerald
    qHead.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
    ws.getRow(r).height = 24;
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => ws.getCell(`${col}${r}`).border = thinBorder);
    r++;

    // QA Table Header
    const qaCols = ['N°', 'Criterio / Escenario de Prueba', 'Pasos / Datos de Prueba', 'Resultado Esperado', 'Estado (Pasa / Falla)', 'Observaciones'];
    const qaHRow = ws.getRow(r);
    qaHRow.height = 24;
    qaCols.forEach((h, idx) => {
      const cell = qaHRow.getCell(idx + 1);
      cell.value = h;
      cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1E293B' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = thinBorder;
    });
    r++;

    for (let i = 1; i <= 4; i++) {
      const row = ws.getRow(r);
      row.height = 28;
      const cellNum = row.getCell(1);
      cellNum.value = i;
      cellNum.alignment = { horizontal: 'center', vertical: 'middle' };
      cellNum.font = { name: 'Calibri', size: 10 };
      cellNum.border = thinBorder;

      for (let c = 2; c <= 6; c++) {
        const cell = row.getCell(c);
        cell.value = '';
        cell.font = { name: 'Calibri', size: 10 };
        cell.border = thinBorder;
        if (c === 5) cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
      r++;
    }
  });

  // Populate Data Rows in Summary Sheet (0. Resumen) with links to each created sheet
  huList.forEach((hu, index) => {
    const rowNum = 6 + index;
    const row = summaryWs.getRow(rowNum);
    row.height = 26;

    const isEven = index % 2 === 0;
    const rowFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: isEven ? 'FFFFFFFF' : 'FFF8FAFC' }
    };

    // Col A: N°
    const cellNum = row.getCell(1);
    cellNum.value = index + 1;
    cellNum.alignment = { horizontal: 'center', vertical: 'middle' };
    cellNum.font = { name: 'Calibri', size: 10, bold: true };
    cellNum.fill = rowFill;
    cellNum.border = thinBorder;

    // Col B: ID
    const cellId = row.getCell(2);
    cellId.value = `#${hu.id}`;
    cellId.alignment = { horizontal: 'center', vertical: 'middle' };
    cellId.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0078D4' } };
    cellId.fill = rowFill;
    cellId.border = thinBorder;

    // Col C: Título
    const cellTitle = row.getCell(3);
    cellTitle.value = hu.title;
    cellTitle.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    cellTitle.font = { name: 'Calibri', size: 10 };
    cellTitle.fill = rowFill;
    cellTitle.border = thinBorder;

    // Col D: Sprint
    const cellSprint = row.getCell(4);
    cellSprint.value = hu.sprintName || hu.iterationPath || 'N/A';
    cellSprint.alignment = { horizontal: 'center', vertical: 'middle' };
    cellSprint.font = { name: 'Calibri', size: 10 };
    cellSprint.fill = rowFill;
    cellSprint.border = thinBorder;

    // Col E: Tipo
    const cellType = row.getCell(5);
    cellType.value = hu.type || 'User Story';
    cellType.alignment = { horizontal: 'center', vertical: 'middle' };
    cellType.font = { name: 'Calibri', size: 10 };
    cellType.fill = rowFill;
    cellType.border = thinBorder;

    // Col F: Estado
    const cellState = row.getCell(6);
    cellState.value = hu.state || 'N/A';
    cellState.alignment = { horizontal: 'center', vertical: 'middle' };
    cellState.font = { name: 'Calibri', size: 10, bold: true };
    cellState.fill = rowFill;
    cellState.border = thinBorder;

    // Col G: Asignado a
    const cellAssigned = row.getCell(7);
    cellAssigned.value = hu.assignedTo || 'Sin asignar';
    cellAssigned.alignment = { horizontal: 'left', vertical: 'middle' };
    cellAssigned.font = { name: 'Calibri', size: 10 };
    cellAssigned.fill = rowFill;
    cellAssigned.border = thinBorder;

    // Col H: Hyperlink to the numbered sheet
    const targetSheet = sheetNameList[index];
    const cellLink = row.getCell(8);
    cellLink.value = { text: `➔ Ver Hoja ${index + 1}`, hyperlink: `#'${targetSheet}'!A1` };
    cellLink.alignment = { horizontal: 'center', vertical: 'middle' };
    cellLink.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0066CC' }, underline: true };
    cellLink.fill = rowFill;
    cellLink.border = thinBorder;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const dateStr = new Date().toISOString().slice(0, 10);
  const cleanProject = sanitizeFilename(project, 'AzureDevOps');
  const filename = `Extraccion_HUs_Azure_${cleanProject}_${dateStr}.xlsx`;
  saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename);
}

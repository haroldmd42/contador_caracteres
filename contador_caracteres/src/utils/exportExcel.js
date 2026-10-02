import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/**
 * Universal Export Function for QA Suite
 * Handles Gherkin, Test Matrix (Excel Table), and Automation Code Downloads
 */
export async function exportToExcel(textResult, mode = "gherkin", framework = "cypress") {
  if (!textResult || typeof textResult !== "string") {
    alert("No existe información para exportar.");
    return;
  }

  // Handle Automation Code File Download
  if (mode === "automation") {
    const isPlaywright = framework === "playwright";
    const filename = isPlaywright ? "test_suite.spec.ts" : "test_suite.cy.js";
    const mimeType = isPlaywright ? "text/typescript;charset=utf-8" : "text/javascript;charset=utf-8";
    const blob = new Blob([textResult], { type: mimeType });
    saveAs(blob, filename);
    return;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "QA TOOLS AI Suite";
  workbook.created = new Date();

  // Mode Matrix Export
  if (mode === "matrix") {
    const worksheet = workbook.addWorksheet("Matriz de Pruebas", {
      views: [{ state: "frozen", ySplit: 1 }]
    });

    const lines = textResult.split(/\r?\n/).filter(line => line.includes("|"));
    const rowsData = [];

    lines.forEach(line => {
      // Split by pipe and remove empty boundary strings
      const cells = line.split("|").map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      // Exclude markdown separator lines like |---|---|
      if (cells.length > 0 && !cells[0].includes("---")) {
        rowsData.push(cells);
      }
    });

    if (rowsData.length > 0) {
      // Header row
      const headers = rowsData[0];
      worksheet.addRow(headers);
      const headerRow = worksheet.getRow(1);
      headerRow.height = 30;

      headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
      });

      // Data rows
      for (let i = 1; i < rowsData.length; i++) {
        const rowData = rowsData[i];
        const row = worksheet.addRow(rowData);
        row.height = 40;
        row.eachCell(cell => {
          cell.alignment = { wrapText: true, vertical: "top" };
          cell.border = { top: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" } };
        });
      }

      // Column widths
      worksheet.columns = headers.map(() => ({ width: 25 }));
    } else {
      // Fallback single column if plain text
      worksheet.addRow(["Contenido de Matriz"]);
      worksheet.addRow([textResult]);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "Matriz_de_Pruebas_QA.xlsx");
    return;
  }

  // Mode Gherkin Export (Default)
  // Check if textResult contains Markdown tables (new prompt format)
  const lines = textResult.split(/\r?\n/);
  let title = "";
  const tables = [];
  let currentTable = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!title && (line.includes("Título:") || line.startsWith("# ") || line.startsWith("## ") || line.startsWith("**HU-") || line.startsWith("**US-") || (line.includes(" - ") && !line.includes("|")))) {
      title = line
        .replace(/^#+\s*/, "")
        .replace(/^-\s*\*\*Título:\*\*\s*/i, "")
        .replace(/^\*\*Título:\*\*\s*/i, "")
        .replace(/\*\*/g, "")
        .trim();
    }

    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line.split("|").map(c => c.trim()).slice(1, -1);
      const isSeparator = cells.every(c => /^:?-+:?$/.test(c));

      if (isSeparator) {
        if (currentTable) {
          currentTable.hasSeparator = true;
        }
        continue;
      }

      if (!currentTable || currentTable.isComplete) {
        let tableName = "";
        for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
          const prev = lines[j].trim();
          if (prev.startsWith("#") || prev.toUpperCase().includes("TABLA") || prev.toUpperCase().includes("CHECKLIST") || prev.toUpperCase().includes("ENUNCIADOS")) {
            tableName = prev.replace(/^#+\s*/, "").replace(/\*\*/g, "").trim();
            break;
          }
        }

        currentTable = {
          name: tableName,
          headers: cells,
          rows: [],
          hasSeparator: false,
          isComplete: false
        };
        tables.push(currentTable);
      } else {
        currentTable.rows.push(cells);
      }
    } else {
      if (currentTable && currentTable.rows.length > 0) {
        currentTable.isComplete = true;
      }
    }
  }

  // If Markdown tables are present, export in a single sheet matching QA template design
  if (tables.length > 0) {
    const worksheet = workbook.addWorksheet("Checklist y Casos de Prueba", {
      views: [{ showGridLines: true }]
    });

    const thinBorder = {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    };

    const headerFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF8EA9DB" } // Calm corporate steel blue matching template
    };

    const table1 = tables[0];
    const table2 = tables.length > 1 ? tables[1] : null;

    let currentRow = 1;

    // 1. Title Banner (Merged A1:E1)
    const titleText = title || "Checklist de Verificación y Casos de Prueba";
    const titleRow = worksheet.getRow(currentRow);
    titleRow.height = 28;
    worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
    const titleCell = worksheet.getCell(`A${currentRow}`);
    titleCell.value = titleText;
    titleCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF000000" } };
    titleCell.fill = headerFill;
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    ["A", "B", "C", "D", "E"].forEach(col => {
      worksheet.getCell(`${col}${currentRow}`).border = thinBorder;
    });

    currentRow++;

    // 2. Table 1 Headers (Row 2)
    const t1HeaderRow = worksheet.getRow(currentRow);
    t1HeaderRow.height = 28;
    table1.headers.forEach((h, idx) => {
      const cell = t1HeaderRow.getCell(idx + 1);
      cell.value = h;
      cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF000000" } };
      cell.fill = headerFill;
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = thinBorder;
    });

    // 3. Side Card: PORCENTAJE DE APROBACIÓN (Rows 2 & 3, Columns H & I)
    worksheet.mergeCells("H2:I2");
    const cardHead = worksheet.getCell("H2");
    cardHead.value = "PORCENTAJE DE APROBACIÓN";
    cardHead.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF000000" } };
    cardHead.fill = headerFill;
    cardHead.alignment = { horizontal: "center", vertical: "middle" };
    ["H2", "I2"].forEach(ref => worksheet.getCell(ref).border = thinBorder);

    worksheet.mergeCells("H3:I3");
    const cardVal = worksheet.getCell("H3");
    cardVal.value = 0;
    cardVal.numFmt = "0%";
    cardVal.font = { name: "Calibri", size: 11, bold: false, color: { argb: "FF000000" } };
    cardVal.alignment = { horizontal: "center", vertical: "middle" };
    ["H3", "I3"].forEach(ref => worksheet.getCell(ref).border = thinBorder);

    const t1StartDataRow = currentRow + 1;
    currentRow++;

    // 4. Table 1 Data Rows
    table1.rows.forEach(rowData => {
      const row = worksheet.getRow(currentRow);
      const textLen = (rowData[2] || "").length;
      row.height = Math.max(32, Math.ceil(textLen / 55) * 16);

      rowData.forEach((val, colIdx) => {
        const cell = row.getCell(colIdx + 1);
        cell.value = val;
        cell.font = { name: "Calibri", size: 10, color: { argb: "FF000000" } };
        const isCase = colIdx === 0;
        const isSourceOrCat = colIdx === 1;
        const isResult = table1.headers[colIdx]?.toLowerCase().includes("resultado");
        cell.alignment = {
          horizontal: isCase || isSourceOrCat || isResult ? "center" : "left",
          vertical: isCase || isSourceOrCat || isResult ? "middle" : "top",
          wrapText: true
        };
        cell.border = thinBorder;
      });
      currentRow++;
    });

    const t1EndRow = currentRow - 1;

    // Set formula for Approval Percentage card
    cardVal.value = {
      formula: `IFERROR(COUNTIF(D${t1StartDataRow}:D${t1EndRow},"Cumple")/COUNTA(D${t1StartDataRow}:D${t1EndRow}),0)`,
      result: 0
    };

    // 5. If Table 2 exists, render it below with spacing
    if (table2) {
      // 3 empty rows spacing (matching screenshot rows 9, 10, 11)
      currentRow += 3;

      // Table 2 Title Banner: "Enunciados de casos de prueba"
      const t2TitleText = table2.name || "Enunciados de casos de prueba";
      const t2TitleRow = worksheet.getRow(currentRow);
      t2TitleRow.height = 26;
      worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
      const t2TitleCell = worksheet.getCell(`A${currentRow}`);
      t2TitleCell.value = t2TitleText;
      t2TitleCell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF000000" } };
      t2TitleCell.fill = headerFill;
      t2TitleCell.alignment = { horizontal: "center", vertical: "middle" };
      ["A", "B", "C", "D"].forEach(col => {
        worksheet.getCell(`${col}${currentRow}`).border = thinBorder;
      });

      currentRow++;

      // Table 2 Headers
      const t2HeaderRow = worksheet.getRow(currentRow);
      t2HeaderRow.height = 26;
      table2.headers.forEach((h, idx) => {
        const cell = t2HeaderRow.getCell(idx + 1);
        cell.value = h;
        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF000000" } };
        cell.fill = headerFill;
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = thinBorder;
      });

      currentRow++;

      // Table 2 Data Rows
      table2.rows.forEach(rowData => {
        const row = worksheet.getRow(currentRow);
        const textLen = (rowData[2] || "").length;
        const lineBreaks = (rowData[2] || "").split("\n").length;
        row.height = Math.max(48, Math.max(lineBreaks * 16, Math.ceil(textLen / 55) * 16));

        rowData.forEach((val, colIdx) => {
          const cell = row.getCell(colIdx + 1);
          cell.value = val;
          cell.font = { name: "Calibri", size: 10, color: { argb: "FF000000" } };
          const isCase = colIdx === 0;
          const isSourceOrCat = colIdx === 1;
          const isResult = table2.headers[colIdx]?.toLowerCase().includes("resultado");
          cell.alignment = {
            horizontal: isCase || isSourceOrCat || isResult ? "center" : "left",
            vertical: isCase || isSourceOrCat || isResult ? "middle" : "top",
            wrapText: true
          };
          cell.border = thinBorder;
        });
        currentRow++;
      });
    }

    // Configure Column Widths matching screenshot layout
    worksheet.getColumn(1).width = 8;   // Col A: Caso
    worksheet.getColumn(2).width = 14;  // Col B: Fuente / Categoría
    worksheet.getColumn(3).width = 65;  // Col C: Criterio o Verificación / Enunciados
    worksheet.getColumn(4).width = 18;  // Col D: Resultado (Cumple/No cumple)
    worksheet.getColumn(5).width = 26;  // Col E: Observaciones
    worksheet.getColumn(6).width = 4;   // Col F: Spacer
    worksheet.getColumn(7).width = 4;   // Col G: Spacer
    worksheet.getColumn(8).width = 15;  // Col H: Card
    worksheet.getColumn(9).width = 15;  // Col I: Card

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "Checklist_Casos_Prueba_QA.xlsx");
    return;
  }

  // Fallback: Legacy Gherkin plain format
  const worksheet = workbook.addWorksheet("Escenarios Gherkin", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  worksheet.columns = [
    { key: "id", width: 10 },
    { key: "contenido", width: 120 },
  ];

  const firstRow = worksheet.getRow(1);
  firstRow.values = ["ID", "Escenario / Pasos Gherkin"];
  firstRow.height = 28;

  firstRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
  });

  let currentScenario = [];
  let scenarioNumber = 0;
  let headerCreated = false;

  const styleRow = (row) => {
    row.height = Math.max(70, currentScenario.length * 18);
    row.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: "top" };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" } };
    });
  };

  const addScenario = () => {
    if (!currentScenario.length) return;
    const row = worksheet.addRow([scenarioNumber, currentScenario.join("\n")]);
    styleRow(row);
    currentScenario = [];
  };

  for (const line of lines) {
    const text = line.trim();
    if (!text) continue;

    if (text.startsWith("Feature:")) {
      addScenario();
      scenarioNumber = 0;
      headerCreated = false;
      worksheet.addRow([]);
      const featureRow = worksheet.addRow([text, ""]);
      worksheet.mergeCells(`A${featureRow.number}:B${featureRow.number}`);
      const cell = featureRow.getCell(1);
      cell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4472C4" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" } };
      featureRow.height = 28;
      continue;
    }

    if (!headerCreated && (text.startsWith("Scenario:") || text.startsWith("Scenario Outline:"))) {
      const header = worksheet.addRow(["No", "Escenario"]);
      header.height = 28;
      header.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "70AD47" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" } };
      });
      headerCreated = true;
    }

    if (text.startsWith("Scenario:") || text.startsWith("Scenario Outline:")) {
      addScenario();
      scenarioNumber++;
      currentScenario.push(text);
      continue;
    }

    currentScenario.push(text);
  }

  addScenario();

  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.alignment = { ...cell.alignment, wrapText: true };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "Escenarios_Gherkin.xlsx");
}

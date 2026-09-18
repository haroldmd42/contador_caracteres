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

  const lines = textResult.split(/\r?\n/);
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

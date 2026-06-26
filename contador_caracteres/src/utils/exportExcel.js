import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function exportToExcel(gherkinText) {
  if (!gherkinText || typeof gherkinText !== "string") {
    alert("No existe información para exportar.");
    return;
  }

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "HU → Gherkin AI";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Escenarios Gherkin", {
    views: [
      {
        state: "frozen",
        ySplit: 1,
      },
    ],
  });

  worksheet.columns = [
    {
      key: "id",
      width: 10,
    },
    {
      key: "contenido",
      width: 120,
    },
  ];

  const firstRow = worksheet.getRow(1);

  firstRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 12,
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "1F4E78",
      },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });

  const lines = gherkinText.split(/\r?\n/);

  let currentScenario = [];
  let scenarioNumber = 0;
  let headerCreated = false;

  const styleRow = (row) => {
    row.height = Math.max(70, currentScenario.length * 18);

    row.eachCell((cell) => {
      cell.alignment = {
        wrapText: true,
        vertical: "top",
      };

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      };
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

    // FEATURE
    if (text.startsWith("Feature:")) {
      addScenario();

      scenarioNumber = 0;
      headerCreated = false;

      worksheet.addRow([]);

      const featureRow = worksheet.addRow([text, ""]);

      worksheet.mergeCells(`A${featureRow.number}:B${featureRow.number}`);

      const cell = featureRow.getCell(1);

      cell.font = {
        bold: true,
        size: 14,
        color: {
          argb: "FFFFFFFF",
        },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "4472C4",
        },
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      };

      featureRow.height = 28;

      continue;
    }

    // Encabezado de escenarios
    if (
      !headerCreated &&
      (text.startsWith("Scenario:") || text.startsWith("Scenario Outline:"))
    ) {
      const header = worksheet.addRow(["No", "Escenario"]);
        header.height = 28;
      header.eachCell((cell) => {
        cell.font = {
          bold: true,
          color: {
            argb: "FFFFFFFF",
          },
        };

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "70AD47",
          },
        };

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        };
      });

      headerCreated = true;
    }

    // Nuevo escenario
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
      cell.alignment = {
        ...cell.alignment,
        wrapText: true,
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    "Escenarios_Gherkin.xlsx",
  );
}

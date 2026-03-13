import DropFiles from "../../components/DropFiles/DropFiles";
import "./CreateFileZize.css";

export default function FileGenerator() {
   const excelFiles = [
      { name: "EXCEL_1MB.xlsx", size: "1 MB", path: `$import.meta.env.BASE_URL}/excel/EXCEL_1MB.lsx` },
      { name: "EXCEL_4MB.xlsx", size: "4 MB", path: `$import.meta.env.BASE_URL}/excel/EXCEL_4MB.xlsx` },
      { name: "EXCEL_9MB.xlsx", size: "9 MB", path: `$import.meta.env.BASE_URL}/excel/EXCEL_9MB.xlsx` },
      { name: "EXCEL_15MB.xlsx", size: "15 MB", path: `$import.meta.env.BASE_URL}/excel/EXCEL_15MB.xlsx`}
   ];

   const pdfFiles = [
      { name: "PDF_1MB.pdf", size: "1 MB", path: `$import.meta.env.BASE_URL}/pdf/PDF_1MB.pdf`},
      { name: "PDF_4MB.pdf", size: "4 MB", path: `$import.meta.env.BASE_URL}/pdf/PDF_4MB.pdf`},
      { name: "PDF_8MB.pdf", size: "8 MB", path: `$import.meta.env.BASE_URL}/pdf/PDF_8MB.pdf`},
      { name: "PDF_14MB.pdf", size: "14 MB", path: `$import.meta.env.BASE_URL}/pdf/PDF_14MB.pdf` }
   ];

   const pptFiles = [
      { name: "PPT_1MB.pptx", size: "1 MB", path: `$import.meta.env.BASE_URL}/ppt/PPT_1MB.pptx` },
      { name: "PPT_4MB.pptx", size: "4 MB", path: `$import.meta.env.BASE_URL}/ppt/PPT_4MB.pptx` },
      { name: "PPT_7MB.pptx", size: "7 MB", path: `$import.meta.env.BASE_URL}/ppt/PPT_7MB.pptx` },
      { name: "PPT_15MB.pptx", size: "15 MB", path: `$import.meta.env.BASE_URL}/ppt/PP_15MB.pptx` }
   ];

   const wordFiles = [
      { name: "WORD_1MB.docx", size: "1 MB", path: `$import.meta.env.BASE_URL}/word/WORD_1MB.docx` },
      { name: "WORD_4MB.docx", size: "4 MB", path: `$import.meta.env.BASE_URL}/word/WORD_4MB.docx` },
      { name: "WORD_6MB.docx", size: "6 MB", path: `$import.meta.env.BASE_URL}/word/WORD_6MB.docx` },
      { name: "WORD_12MB.docx", size: "12 MB", path: `$import.meta.env.BASE_URL}/word/WORD_12MB.docx` }
   ];
   return (
      <div className="generator-body container">

         <div className="text-center header-section">
            <h1>Biblioteca de archivos</h1>

            <p className="subtitle">
               Explora y descarga archivos de prueba en diferentes formatos y tamaños.
               Ideales para validar cargas, límites de peso y pruebas funcionales.
            </p>
         </div>

         <div className="row g-4 mt-3">

            <div className="col-lg-3 col-md-6">
               <DropFiles title="Excel" type="excel" files={excelFiles} />
            </div>

            <div className="col-lg-3 col-md-6">
               <DropFiles title="PDF" type="pdf" files={pdfFiles} />
            </div>

            <div className="col-lg-3 col-md-6">
               <DropFiles title="PowerPoint" type="ppt" files={pptFiles} />
            </div>

            <div className="col-lg-3 col-md-6">
               <DropFiles title="Word" type="word" files={wordFiles} />
            </div>

         </div>

      </div>
   );
}
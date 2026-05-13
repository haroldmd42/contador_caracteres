/**
 * File library data for the downloadable test files page.
 * Organized by file type with name, display size, and download path.
 */

const BASE = import.meta.env.BASE_URL;

export const FILE_CATEGORIES = [
  {
    title: 'Excel',
    type: 'excel',
    files: [
      { name: 'EXCEL_1MB.xlsx', size: '1 MB', path: `${BASE}files/excel/EXCEL_1MB.xlsx` },
      { name: 'EXCEL_4MB.xlsx', size: '4 MB', path: `${BASE}files/excel/EXCEL_4MB.xlsx` },
      { name: 'EXCEL_9MB.xlsx', size: '9 MB', path: `${BASE}files/excel/EXCEL_9MB.xlsx` },
      { name: 'EXCEL_15MB.xlsx', size: '15 MB', path: `${BASE}files/excel/EXCEL_15MB.xlsx` },
    ],
  },
  {
    title: 'PDF',
    type: 'pdf',
    files: [
      { name: 'PDF_1MB.pdf', size: '1 MB', path: `${BASE}files/pdf/PDF_1MB.pdf` },
      { name: 'PDF_4MB.pdf', size: '4 MB', path: `${BASE}files/pdf/PDF_4MB.pdf` },
      { name: 'PDF_8MB.pdf', size: '8 MB', path: `${BASE}files/pdf/PDF_8MB.pdf` },
      { name: 'PDF_14MB.pdf', size: '14 MB', path: `${BASE}files/pdf/PDF_14MB.pdf` },
    ],
  },
  {
    title: 'PowerPoint',
    type: 'ppt',
    files: [
      { name: 'PPT_1MB.pptx', size: '1 MB', path: `${BASE}files/ppt/PPT_1MB.pptx` },
      { name: 'PPT_4MB.pptx', size: '4 MB', path: `${BASE}files/ppt/PPT_4MB.pptx` },
      { name: 'PPT_7MB.pptx', size: '7 MB', path: `${BASE}files/ppt/PPT_7MB.pptx` },
      { name: 'PPT_15MB.pptx', size: '15 MB', path: `${BASE}files/ppt/PPT_15MB.pptx` },
    ],
  },
  {
    title: 'Word',
    type: 'word',
    files: [
      { name: 'WORD_1MB.docx', size: '1 MB', path: `${BASE}files/word/WORD_1MB.docx` },
      { name: 'WORD_4MB.docx', size: '4 MB', path: `${BASE}files/word/WORD_4MB.docx` },
      { name: 'WORD_6MB.docx', size: '6 MB', path: `${BASE}files/word/WORD_6MB.docx` },
      { name: 'WORD_12MB.docx', size: '12 MB', path: `${BASE}files/word/WORD_12MB.docx` },
    ],
  },
];

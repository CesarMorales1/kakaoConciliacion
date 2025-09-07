export interface ExcelFile {
  id: string;
  originalName: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  uploadedAt: Date;
}

export interface ExcelSheet {
  name: string;
  data: any[][];
  headers: string[];
  rowCount: number;
}

export interface ProcessedExcelData {
  file: ExcelFile;
  sheets: ExcelSheet[];
  totalSheets: number;
  processedAt: Date;
}
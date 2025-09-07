import { ExcelSheet, ProcessedExcelData } from '../entities/ExcelFile';

export interface IExcelProcessorService {
  processExcelFile(filePath: string): Promise<ExcelSheet[]>;
  validateExcelFile(filePath: string): Promise<boolean>;
  extractSheetData(filePath: string, sheetName?: string): Promise<ExcelSheet>;
}
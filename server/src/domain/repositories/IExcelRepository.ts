import { ExcelFile, ProcessedExcelData } from '../entities/ExcelFile';

export interface IExcelRepository {
  saveFile(file: ExcelFile): Promise<ExcelFile>;
  getFileById(id: string): Promise<ExcelFile | null>;
  getAllFiles(): Promise<ExcelFile[]>;
  deleteFile(id: string): Promise<boolean>;
  saveProcessedData(data: ProcessedExcelData): Promise<ProcessedExcelData>;
}
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { IExcelProcessorService } from '../../domain/services/IExcelProcessorService';
import { ExcelSheet } from '../../domain/entities/ExcelFile';

export class ExcelProcessorService implements IExcelProcessorService {
  async processExcelFile(filePath: string): Promise<ExcelSheet[]> {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheets: ExcelSheet[] = [];

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const headers = jsonData[0] as string[] || [];
        const data = jsonData.slice(1) as any[][];

        sheets.push({
          name: sheetName,
          data,
          headers,
          rowCount: data.length
        });
      }

      return sheets;
    } catch (error) {
      throw new Error(`Error al procesar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async validateExcelFile(filePath: string): Promise<boolean> {
    try {
      if (!fs.existsSync(filePath)) {
        return false;
      }

      const workbook = XLSX.readFile(filePath);
      return workbook.SheetNames.length > 0;
    } catch (error) {
      return false;
    }
  }

  async extractSheetData(filePath: string, sheetName?: string): Promise<ExcelSheet> {
    try {
      const workbook = XLSX.readFile(filePath);
      const targetSheet = sheetName || workbook.SheetNames[0];
      
      if (!workbook.Sheets[targetSheet]) {
        throw new Error(`Hoja "${targetSheet}" no encontrada`);
      }

      const worksheet = workbook.Sheets[targetSheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      const headers = jsonData[0] as string[] || [];
      const data = jsonData.slice(1) as any[][];

      return {
        name: targetSheet,
        data,
        headers,
        rowCount: data.length
      };
    } catch (error) {
      throw new Error(`Error al extraer datos de la hoja: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
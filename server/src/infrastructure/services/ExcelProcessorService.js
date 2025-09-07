import XLSX from 'xlsx';
import fs from 'fs';
import IExcelProcessorService from '../../domain/services/IExcelProcessorService.js';
import { ExcelSheet } from '../../domain/entities/ExcelFile.js';

/**
 * Servicio de procesamiento de archivos Excel
 */
export default class ExcelProcessorService extends IExcelProcessorService {
  async processExcelFile(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheets = [];

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const headers = jsonData[0] || [];
        const data = jsonData.slice(1);

        const sheet = new ExcelSheet(
          sheetName,
          data,
          headers,
          data.length
        );

        sheets.push(sheet);
      }

      return sheets;
    } catch (error) {
      throw new Error(`Error al procesar archivo Excel: ${error.message}`);
    }
  }

  async validateExcelFile(filePath) {
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

  async extractSheetData(filePath, sheetName) {
    try {
      const workbook = XLSX.readFile(filePath);
      const targetSheet = sheetName || workbook.SheetNames[0];
      
      if (!workbook.Sheets[targetSheet]) {
        throw new Error(`Hoja "${targetSheet}" no encontrada`);
      }

      const worksheet = workbook.Sheets[targetSheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      const headers = jsonData[0] || [];
      const data = jsonData.slice(1);

      return new ExcelSheet(
        targetSheet,
        data,
        headers,
        data.length
      );
    } catch (error) {
      throw new Error(`Error al extraer datos de la hoja: ${error.message}`);
    }
  }
}
import { v4 as uuidv4 } from 'uuid';
import { ExcelFile, ProcessedExcelData } from '../../domain/entities/ExcelFile.js';

/**
 * Caso de uso para subir y procesar archivos Excel
 */
export default class UploadExcelUseCase {
  constructor(excelRepository, excelProcessor) {
    this.excelRepository = excelRepository;
    this.excelProcessor = excelProcessor;
  }

  async execute(fileData) {
    try {
      // Crear entidad de archivo
      const excelFile = new ExcelFile(
        uuidv4(),
        fileData.originalName,
        fileData.filename,
        fileData.path,
        fileData.size,
        fileData.mimetype
      );

      // Validar archivo Excel
      const isValid = await this.excelProcessor.validateExcelFile(fileData.path);
      if (!isValid) {
        throw new Error('El archivo no es un Excel válido');
      }

      // Procesar archivo Excel
      const sheets = await this.excelProcessor.processExcelFile(fileData.path);

      // Guardar archivo en repositorio
      const savedFile = await this.excelRepository.saveFile(excelFile);

      // Crear datos procesados
      const processedData = new ProcessedExcelData(
        savedFile,
        sheets,
        sheets.length
      );

      // Guardar datos procesados
      await this.excelRepository.saveProcessedData(processedData);

      return processedData;
    } catch (error) {
      throw new Error(`Error al procesar archivo Excel: ${error.message}`);
    }
  }
}
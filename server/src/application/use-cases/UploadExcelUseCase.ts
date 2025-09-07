import { v4 as uuidv4 } from 'uuid';
import { IExcelRepository } from '../../domain/repositories/IExcelRepository';
import { IExcelProcessorService } from '../../domain/services/IExcelProcessorService';
import { ExcelFile, ProcessedExcelData } from '../../domain/entities/ExcelFile';

export class UploadExcelUseCase {
  constructor(
    private excelRepository: IExcelRepository,
    private excelProcessor: IExcelProcessorService
  ) {}

  async execute(fileData: {
    originalName: string;
    filename: string;
    path: string;
    size: number;
    mimetype: string;
  }): Promise<ProcessedExcelData> {
    try {
      // Crear entidad de archivo
      const excelFile: ExcelFile = {
        id: uuidv4(),
        originalName: fileData.originalName,
        filename: fileData.filename,
        path: fileData.path,
        size: fileData.size,
        mimetype: fileData.mimetype,
        uploadedAt: new Date()
      };

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
      const processedData: ProcessedExcelData = {
        file: savedFile,
        sheets,
        totalSheets: sheets.length,
        processedAt: new Date()
      };

      // Guardar datos procesados
      await this.excelRepository.saveProcessedData(processedData);

      return processedData;
    } catch (error) {
      throw new Error(`Error al procesar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
import { IExcelRepository } from '../../domain/repositories/IExcelRepository';
import { ExcelFile } from '../../domain/entities/ExcelFile';

export class GetExcelFilesUseCase {
  constructor(private excelRepository: IExcelRepository) {}

  async execute(): Promise<ExcelFile[]> {
    try {
      return await this.excelRepository.getAllFiles();
    } catch (error) {
      throw new Error(`Error al obtener archivos Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
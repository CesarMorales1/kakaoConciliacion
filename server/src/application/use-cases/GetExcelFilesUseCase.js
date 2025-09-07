/**
 * Caso de uso para obtener todos los archivos Excel
 */
export default class GetExcelFilesUseCase {
  constructor(excelRepository) {
    this.excelRepository = excelRepository;
  }

  async execute() {
    try {
      return await this.excelRepository.getAllFiles();
    } catch (error) {
      throw new Error(`Error al obtener archivos Excel: ${error.message}`);
    }
  }
}
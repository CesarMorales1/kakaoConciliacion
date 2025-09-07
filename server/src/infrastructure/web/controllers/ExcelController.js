/**
 * Controlador para manejar operaciones con archivos Excel
 */
export default class ExcelController {
  constructor(uploadExcelUseCase, getExcelFilesUseCase) {
    this.uploadExcelUseCase = uploadExcelUseCase;
    this.getExcelFilesUseCase = getExcelFilesUseCase;
  }

  async uploadExcel(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se ha proporcionado ningún archivo'
        });
      }

      const fileData = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      };

      const processedData = await this.uploadExcelUseCase.execute(fileData);

      res.status(200).json({
        success: true,
        message: 'Archivo Excel procesado exitosamente',
        data: {
          file: processedData.file,
          totalSheets: processedData.totalSheets,
          sheets: processedData.sheets.map(sheet => ({
            name: sheet.name,
            rowCount: sheet.rowCount,
            headers: sheet.headers
          })),
          processedAt: processedData.processedAt
        }
      });
    } catch (error) {
      console.error('Error al procesar archivo Excel:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  async getExcelFiles(req, res) {
    try {
      const files = await this.getExcelFilesUseCase.execute();
      
      res.status(200).json({
        success: true,
        data: files
      });
    } catch (error) {
      console.error('Error al obtener archivos Excel:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }
}
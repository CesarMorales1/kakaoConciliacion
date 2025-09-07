import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar dependencias de la aplicación
import ExcelProcessorService from './infrastructure/services/ExcelProcessorService.js';
import InMemoryExcelRepository from './infrastructure/repositories/InMemoryExcelRepository.js';
import UploadExcelUseCase from './application/use-cases/UploadExcelUseCase.js';
import GetExcelFilesUseCase from './application/use-cases/GetExcelFilesUseCase.js';
import ExcelController from './infrastructure/web/controllers/ExcelController.js';
import createExcelRoutes from './infrastructure/web/routes/excelRoutes.js';

// Configuración del servidor
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // URL del frontend en desarrollo
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Inyección de dependencias
const excelProcessor = new ExcelProcessorService();
const excelRepository = new InMemoryExcelRepository();
const uploadExcelUseCase = new UploadExcelUseCase(excelRepository, excelProcessor);
const getExcelFilesUseCase = new GetExcelFilesUseCase(excelRepository);
const excelController = new ExcelController(uploadExcelUseCase, getExcelFilesUseCase);

// Configurar rutas
app.use('/api/excel', createExcelRoutes(excelController));

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'El archivo es demasiado grande. Máximo 10MB permitido.'
    });
  }

  if (error.message.includes('Solo se permiten archivos Excel')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📁 Directorio de uploads: ${path.join(__dirname, '../uploads')}`);
});
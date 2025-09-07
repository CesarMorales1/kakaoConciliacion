import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

/**
 * Configuración de rutas para archivos Excel
 */
export default function createExcelRoutes(excelController) {
  const router = express.Router();

  // Ruta para subir archivo Excel
  router.post('/upload', upload.single('excel'), (req, res) => {
    excelController.uploadExcel(req, res);
  });

  // Ruta para obtener todos los archivos Excel
  router.get('/files', (req, res) => {
    excelController.getExcelFiles(req, res);
  });

  return router;
}
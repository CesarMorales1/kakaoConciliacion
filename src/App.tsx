import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X } from 'lucide-react';

interface UploadedFile {
  file: File;
  name: string;
  size: number;
}

function App() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isExcelFile = (file: File): boolean => {
    const acceptedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      '.xlsx',
      '.xls'
    ];
    return acceptedTypes.some(type => 
      file.type === type || file.name.toLowerCase().endsWith(type)
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files: FileList) => {
    if (files.length === 0) return;

    const file = files[0];
    
    if (!isExcelFile(file)) {
      setError('Por favor, selecciona un archivo Excel válido (.xlsx o .xls)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('El archivo es demasiado grande. Máximo 10MB permitido.');
      return;
    }

    setUploadedFile({
      file,
      name: file.name,
      size: file.size
    });
    setError('');
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async () => {
    if (!uploadedFile) return;

    try {
      const formData = new FormData();
      formData.append('excel', uploadedFile.file);

      const response = await fetch('http://localhost:3001/api/excel/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log('Archivo procesado exitosamente:', result.data);
        alert(`¡Archivo procesado exitosamente!\n\nTotal de hojas: ${result.data.totalSheets}\nHojas encontradas: ${result.data.sheets.map(s => s.name).join(', ')}`);
      } else {
        setError(result.message || 'Error al procesar el archivo');
      }
    } catch (error) {
      console.error('Error al subir archivo:', error);
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header con Kakao 40 */}
      <div className="absolute top-6 left-6">
        <h1 className="text-2xl font-bold text-slate-800">Kakao 40</h1>
      </div>

      {/* Contenido principal */}
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Cargar Archivo Excel
                </h2>
                <p className="text-slate-600">
                  Arrastra y suelta tu archivo Excel aquí o haz clic para seleccionar
                </p>
              </div>

              {/* Zona de carga */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 transform scale-[1.02]'
                    : uploadedFile
                    ? 'border-green-300 bg-green-50'
                    : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
                } cursor-pointer`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={openFileDialog}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                  onChange={handleFileInput}
                  className="hidden"
                />

                {uploadedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileSpreadsheet className="w-8 h-8 text-green-600" />
                          <div className="text-left">
                            <p className="font-medium text-slate-800 truncate max-w-xs">
                              {uploadedFile.name}
                            </p>
                            <p className="text-sm text-slate-600">
                              {formatFileSize(uploadedFile.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                          }}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-green-600 font-medium">
                      ¡Archivo cargado exitosamente!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Upload className="w-12 h-12 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-slate-700 mb-2">
                        {dragActive ? '¡Suelta el archivo aquí!' : 'Selecciona tu archivo Excel'}
                      </p>
                      <p className="text-slate-500 text-sm">
                        Formatos soportados: .xlsx, .xls (máximo 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={openFileDialog}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Seleccionar Archivo</span>
                </button>
                
                {uploadedFile && (
                  <button
                    onClick={uploadFile}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                  >
                    Procesar Archivo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
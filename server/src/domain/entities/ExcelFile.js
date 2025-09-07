/**
 * Entidad que representa un archivo Excel
 */
export class ExcelFile {
  constructor(id, originalName, filename, path, size, mimetype, uploadedAt = new Date()) {
    this.id = id;
    this.originalName = originalName;
    this.filename = filename;
    this.path = path;
    this.size = size;
    this.mimetype = mimetype;
    this.uploadedAt = uploadedAt;
  }
}

/**
 * Entidad que representa una hoja de Excel procesada
 */
export class ExcelSheet {
  constructor(name, data, headers, rowCount) {
    this.name = name;
    this.data = data;
    this.headers = headers;
    this.rowCount = rowCount;
  }
}

/**
 * Entidad que representa los datos procesados de un archivo Excel
 */
export class ProcessedExcelData {
  constructor(file, sheets, totalSheets, processedAt = new Date()) {
    this.file = file;
    this.sheets = sheets;
    this.totalSheets = totalSheets;
    this.processedAt = processedAt;
  }
}
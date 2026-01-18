declare module 'pdf-parse' {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: {
      PDFFormatVersion?: string;
      IsAcroFormPresent?: boolean;
      IsXFAPresent?: boolean;
      Title?: string;
      Author?: string;
      Subject?: string;
      Keywords?: string;
      Creator?: string;
      Producer?: string;
      CreationDate?: string;
      ModDate?: string;
    };
    metadata: any;
    text: string;
    version: string;
  }

  interface PDFOptions {
    pagerender?: (pageData: any) => string;
    max?: number;
    version?: string;
  }

  function pdfParse(dataBuffer: Buffer, options?: PDFOptions): Promise<PDFData>;
  
  export = pdfParse;
}

declare module 'formidable' {
  import { IncomingMessage } from 'http';
  
  interface Fields {
    [key: string]: string | string[];
  }
  
  interface Files {
    [key: string]: File | File[];
  }
  
  interface File {
    size: number;
    filepath: string;
    originalFilename: string | null;
    newFilename: string;
    mimetype: string | null;
    mtime: Date | null;
    hashAlgorithm: false | 'sha1' | 'md5' | 'sha256';
    hash: string | null;
  }
  
  interface Options {
    encoding?: string;
    uploadDir?: string;
    keepExtensions?: boolean;
    maxFileSize?: number;
    maxFieldsSize?: number;
    maxFields?: number;
    hash?: boolean | 'sha1' | 'md5' | 'sha256';
    multiples?: boolean;
    filename?: (name: string, ext: string, part: any, form: any) => string;
    filter?: (part: any) => boolean;
  }
  
  class IncomingForm {
    constructor(options?: Options);
    parse(req: IncomingMessage, callback?: (err: any, fields: Fields, files: Files) => void): void;
  }
  
  export { IncomingForm, Fields, Files, File, Options };
}

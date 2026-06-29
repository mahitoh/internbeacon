const { PDFParse } = require('pdf-parse'); // v2 class API — calling the module as a function throws

const PDF_MIME  = 'application/pdf';
const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const SUPPORTED_CV_MIMES = new Set([PDF_MIME, DOCX_MIME]);

// Routes a CV buffer to the right text extractor by its detected MIME type, so
// upload validation and parse-cv text extraction share one source of truth for
// "what counts as a supported CV format" and how to read text out of it.
async function extractCvText(buffer, mime) {
  if (mime === PDF_MIME) {
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const parsed = await parser.getText();
    return parsed.text || '';
  }
  if (mime === DOCX_MIME) {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  }
  throw Object.assign(new Error('Unsupported CV file format'), { status: 400 });
}

function extensionForMime(mime) {
  if (mime === DOCX_MIME) return 'docx';
  return 'pdf';
}

module.exports = { extractCvText, extensionForMime, SUPPORTED_CV_MIMES, PDF_MIME, DOCX_MIME };

const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const UPLOAD_ROOT = path.resolve(process.cwd(), 'uploads');

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const extFromMime = (mime = '') => {
  if (mime.includes('jpeg') || mime.includes('jpg')) return '.jpg';
  if (mime.includes('png')) return '.png';
  if (mime.includes('webp')) return '.webp';
  return '';
};

const saveImageBuffer = async ({ buffer, originalName, mimeType, folder }) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('No valid file buffer provided');
  }

  const targetDir = path.join(UPLOAD_ROOT, folder || 'misc');
  ensureDir(targetDir);

  const originalExt = path.extname(originalName || '').toLowerCase();
  const ext = originalExt || extFromMime(mimeType) || '.bin';
  const fileName = `${Date.now()}-${randomUUID()}${ext}`;
  const fullPath = path.join(targetDir, fileName);

  await fs.promises.writeFile(fullPath, buffer);

  const publicPath = `/uploads/${folder || 'misc'}/${fileName}`;
  return {
    fileName,
    fullPath,
    publicPath,
    size: buffer.length,
    mimeType,
  };
};

module.exports = {
  saveImageBuffer,
  UPLOAD_ROOT,
};

import uuid from 'node-uuid';
import Promise from 'bluebird';
import { writeFile } from 'fs';

import download from './download';
import TmpDirectory from './tmpDirectory';

const writeFileP = Promise.promisify(writeFile);

/**
 * Downloads the to-be-merged files to the tmp directory on the server.
 * @param {String[]} urls - The URLs of the PDFs to be downloaded.
 * @returns {String[]} - Filepaths of the downloaded PDFs.
 */
async function downloadPdfs(urls) {
  console.time('Save pdfs to tmp directory');

  const tmp = new TmpDirectory();
  const tmpPath = await tmp.create();
  const pdfPaths = Promise.map(urls, function (pdfUrl) {
    return downloadToPath(tmpPath, pdfUrl);
  });

  pdfPaths.then(function () {
    console.timeEnd('Save pdfs to tmp directory');
  });

  return pdfPaths;
}

async function downloadToPath(directory, url) {
  const buffer = await download(url);

  return writeToPath(directory, buffer);
}

async function writeToPath(directory, buffer) {
  const filePath = `${directory}/${uuid.v4()}.pdf`

  await writeFileP(filePath, buffer);

  return filePath;
}

export default downloadPdfs;

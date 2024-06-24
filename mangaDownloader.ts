import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { image } from 'image-downloader';
import { PDFDocument } from 'pdf-lib';
import { Command } from 'commander';

const program = new Command();

program
  .requiredOption('-c, --chapter-id <chapterId>', 'Chapter ID')
  .option('-o, --output <output>', 'Output PDF file', 'output.pdf');

program.parse(process.argv);

const options = program.opts();

const MANGADEX_API_BASE = 'https://api.mangadex.org';

async function fetchChapterPages(chapterId: string) {
  try {
    const chapterUrl = `${MANGADEX_API_BASE}/chapter/${chapterId}`;
    const chapterResponse = await axios.get(chapterUrl);
    const chapterData = chapterResponse.data.data;

    const hash = chapterData.attributes.hash;
    const pageArray = chapterData.attributes.data;

    const baseUrl = `${MANGADEX_API_BASE}/at-home/server/${chapterId}`;
    const serverResponse = await axios.get(baseUrl);
    const serverUrl = serverResponse.data.baseUrl;

    return pageArray.map((filename: string) => `${serverUrl}/data/${hash}/${filename}`);
  } catch (error) {
    console.error('Error fetching chapter pages:', error);
    throw error;
  }
}

async function downloadImage(url: string, outputPath: string) {
  try {
    await image({
      url,
      dest: outputPath,
    });
    console.log(`Downloaded ${url} to ${outputPath}`);
  } catch (error) {
    console.error(`Error downloading image ${url}:`, error);
    throw error;
  }
}

async function downloadChapterPages(pages: string[], downloadDir: string) {
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  const downloadPromises = pages.map((pageUrl, index) => {
    const filePath = path.join(downloadDir, `${index + 1}.jpg`);
    return downloadImage(pageUrl, filePath);
  });

  await Promise.all(downloadPromises);
}

async function createPdfFromImages(imageDir: string, outputPdfPath: string) {
  const pdfDoc = await PDFDocument.create();

  const files = fs.readdirSync(imageDir).filter(file => file.endsWith('.jpg'));
  files.sort((a, b) => parseInt(a) - parseInt(b));

  for (const file of files) {
    const filePath = path.join(imageDir, file);
    const imageBytes = fs.readFileSync(filePath);
    const image = await pdfDoc.embedJpg(imageBytes);

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPdfPath, pdfBytes);
}

(async () => {
  const { chapterId, output } = options;

  try {
    const pages = await fetchChapterPages(chapterId);
    const downloadDir = path.join(__dirname, 'downloads', chapterId);

    await downloadChapterPages(pages, downloadDir);
    await createPdfFromImages(downloadDir, output);

    console.log(`PDF created at ${output}`);
  } catch (error) {
    console.error('Error:', error);
  }
})();

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';

const inputDir = path.resolve('assets/images');
const outputDir = path.resolve('assets/images/optimized');
const outputDirRelative = path.relative(inputDir, outputDir);

function ensureDirectory(dirPath) {
   if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
   }
}

function isInsideDirectory(targetPath, parentPath) {
   const relativePath = path.relative(parentPath, targetPath);
   return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath));
}

function shouldSkipDirectory(dirPath) {
   return isInsideDirectory(dirPath, outputDir);
}

async function optimizePng(inputPath, outputPath) {
   try {
      await imagemin([inputPath], {
         destination: path.dirname(outputPath),
         plugins: [
            imageminPngquant({
               quality: [0.6, 0.8]
            })
         ]
      });
      console.log(`[png] optimized: ${inputPath}`);
   } catch (error) {
      console.error(`[png] failed: ${inputPath}`, error.message);
   }
}

async function convertToWebp(inputPath, outputPath) {
   const outputWebpPath = outputPath.replace(/\.png$/i, '.webp');
   try {
      await sharp(inputPath).webp({ quality: 80 }).toFile(outputWebpPath);
      console.log(`[webp] created: ${outputWebpPath}`);
   } catch (error) {
      console.error(`[webp] failed: ${inputPath}`, error.message);
   }
}

async function optimizeSvg(inputPath, outputPath) {
   try {
      await imagemin([inputPath], {
         destination: path.dirname(outputPath),
         plugins: [
            imageminSvgo({
               plugins: [
                  {
                     name: 'preset-default',
                     params: {
                        overrides: {
                           removeViewBox: false
                        }
                     }
                  }
               ]
            })
         ]
      });
      console.log(`[svg] optimized: ${inputPath}`);
   } catch (error) {
      console.error(`[svg] failed: ${inputPath}`, error.message);
   }
}

async function processDirectory(dirPath) {
   const files = fs.readdirSync(dirPath);

   for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
         if (shouldSkipDirectory(filePath)) {
            continue;
         }

         await processDirectory(filePath);
         continue;
      }

      const relativePath = path.relative(inputDir, filePath);
      if (
         relativePath === outputDirRelative ||
         relativePath.startsWith(`${outputDirRelative}${path.sep}`)
      ) {
         continue;
      }

      const outputPath = path.join(outputDir, relativePath);
      ensureDirectory(path.dirname(outputPath));

      const ext = path.extname(file).toLowerCase();
      if (ext === '.png') {
         await optimizePng(filePath, outputPath);
         await convertToWebp(filePath, outputPath);
      } else if (ext === '.svg') {
         await optimizeSvg(filePath, outputPath);
      } else {
         fs.copyFileSync(filePath, outputPath);
      }
   }
}

(async () => {
   try {
      ensureDirectory(outputDir);
      console.log('[start] image optimization');
      await processDirectory(inputDir);
      console.log(`[done] output: ${outputDir}`);
   } catch (error) {
      console.error('[fatal] image optimization failed', error);
      process.exitCode = 1;
   }
})();

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const modelsDir = './assets/models';

async function convertWebpToJpg() {
  const folders = fs.readdirSync(modelsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const folder of folders) {
    const folderPath = path.join(modelsDir, folder);
    const files = fs.readdirSync(folderPath);
    
    for (const file of files) {
      if (file.endsWith('.webp')) {
        const inputPath = path.join(folderPath, file);
        const outputPath = path.join(folderPath, file.replace('.webp', '.jpg'));
        
        console.log(`Converting ${inputPath} -> ${outputPath}`);
        
        try {
          await sharp(inputPath)
            .jpeg({ quality: 90 })
            .toFile(outputPath);
          
          // Remove the webp file
          fs.unlinkSync(inputPath);
          console.log(`  Done!`);
        } catch (err) {
          console.error(`  Error: ${err.message}`);
        }
      }
    }
  }
  
  console.log('All conversions complete!');
}

convertWebpToJpg();

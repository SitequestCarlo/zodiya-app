import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// Find all texture folders
const modelsDir = './assets/models';
const folders = readdirSync(modelsDir)
  .filter(name => {
    const path = join(modelsDir, name);
    return statSync(path).isDirectory() && name !== 'original' && name !== 'separated';
  });

console.log(`Found ${folders.length} texture folders to optimize\n`);

let totalOriginal = 0;
let totalOptimized = 0;

// Process each folder
for (const folder of folders) {
  const folderPath = join(modelsDir, folder);
  const files = readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  
  console.log(`\nProcessing folder: ${folder}`);
  
  for (const file of files) {
    const filePath = join(folderPath, file);
    const originalSize = statSync(filePath).size;
    totalOriginal += originalSize;
    
    console.log(`  ${file}: ${(originalSize / 1024).toFixed(2)} KB`);
    
    try {
      // Compress image - more aggressive settings
      await sharp(filePath)
        .resize(512, 512, { // Reduce to 512x512 - plenty for mobile 3D textures
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ 
          quality: 75, // Lower quality for smaller files
          mozjpeg: true // Use mozjpeg for better compression
        })
        .toFile(filePath + '.tmp');
      
      // Get new size
      const newSize = statSync(filePath + '.tmp').size;
      totalOptimized += newSize;
      
      // Only replace if smaller
      if (newSize < originalSize) {
        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        console.log(`    → ${(newSize / 1024).toFixed(2)} KB (${reduction}% smaller)`);
        
        // Replace original with optimized
        const fs = await import('fs');
        fs.unlinkSync(filePath);
        fs.renameSync(filePath + '.tmp', filePath);
      } else {
        console.log(`    → Skipped (would be larger)`);
        const fs = await import('fs');
        fs.unlinkSync(filePath + '.tmp');
        totalOptimized += originalSize; // Keep original size in total
      }
      
    } catch (error) {
      console.error(`    ✗ Error:`, error.message);
      totalOptimized += originalSize; // Keep original size in total
    }
  }
}

console.log(`\n\nTotal reduction:`);
console.log(`  Original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
console.log(`  Optimized: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
console.log(`  Saved: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)} MB (${((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1)}%)`);

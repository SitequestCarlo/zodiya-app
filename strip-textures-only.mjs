import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const modelsDir = './assets/models/original';
const files = readdirSync(modelsDir)
  .filter(file => file.endsWith('.glb'))
  .map(file => join(modelsDir, file));

console.log(`Found ${files.length} GLB files\n`);

for (const filePath of files) {
  const fileName = basename(filePath);
  console.log(`Processing: ${fileName}`);
  
  try {
    const originalSize = statSync(filePath).size;
    console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    
    const document = await io.read(filePath);
    const root = document.getRoot();
    
    // ONLY dispose texture images - don't touch anything else
    root.listTextures().forEach(texture => texture.dispose());
    
    await io.write(filePath, document);
    
    const newSize = statSync(filePath).size;
    console.log(`  After: ${(newSize / 1024 / 1024).toFixed(2)} MB (${((originalSize - newSize) / originalSize * 100).toFixed(1)}% reduction)\n`);
    
  } catch (error) {
    console.error(`  ✗ Error:`, error.message, '\n');
  }
}

console.log('Done!');

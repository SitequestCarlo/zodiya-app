import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune } from '@gltf-transform/functions';
import { readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

// Initialize IO with extensions
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);

// Get all GLB files from the original models folder
const modelsDir = './assets/models/original';
const files = readdirSync(modelsDir)
  .filter(file => file.endsWith('.glb'))
  .map(file => join(modelsDir, file));

console.log(`Found ${files.length} GLB files to optimize\n`);

// Process each model
for (const filePath of files) {
  const fileName = basename(filePath);
  const outputPath = filePath;
  
  console.log(`Processing: ${fileName}`);
  
  try {
    // Get original file size
    const originalSize = statSync(filePath).size;
    console.log(`  Original size: ${(originalSize / 1024).toFixed(2)} KB`);
    
    // Load the GLB
    const document = await io.read(filePath);
    
    // ONLY remove embedded texture images - keep ALL geometry, UVs, materials
    const root = document.getRoot();
    
    // Remove textures completely
    const textures = root.listTextures();
    textures.forEach(texture => texture.dispose());
    
    // Clean up orphaned data
    await document.transform(prune());
    
    // Write optimized GLB
    await io.write(outputPath, document);
    
    // Get new file size
    const newSize = statSync(outputPath).size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`  Optimized size: ${(newSize / 1024).toFixed(2)} KB`);
    console.log(`  Reduction: ${reduction}%`);
    console.log(`  ✓ Saved to: ${outputPath}\n`);
    
  } catch (error) {
    console.error(`  ✗ Error processing ${fileName}:`, error.message);
    console.log('');
  }
}

console.log('Optimization complete!');

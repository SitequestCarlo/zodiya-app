import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { simplify, weld, dedup } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import { statSync } from 'fs';

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);

const largeModels = [
  { path: './assets/models/original/Krebs_adularia.glb', ratio: 0.3 }, // Keep only 30% of triangles
  { path: './assets/models/original/steinbock_onyx.glb', ratio: 0.5 }  // Keep 50% of triangles
];

console.log('Optimizing large models with geometry simplification...\n');

for (const { path, ratio } of largeModels) {
  console.log(`Processing: ${path}`);
  
  try {
    const originalSize = statSync(path).size;
    console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    
    const document = await io.read(path);
    
    // Apply aggressive geometry optimization
    await document.transform(
      // Weld nearby vertices first
      weld({ tolerance: 0.0001 }),
      
      // Remove duplicates
      dedup(),
      
      // Simplify geometry aggressively
      simplify({
        simplifier: MeshoptSimplifier,
        ratio: ratio,
        error: 0.01 // Allow more error for aggressive simplification
      })
    );
    
    await io.write(path, document);
    
    const newSize = statSync(path).size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`  After: ${(newSize / 1024 / 1024).toFixed(2)} MB (${reduction}% reduction)`);
    console.log(`  Target was ${(ratio * 100)}% triangles\n`);
    
  } catch (error) {
    console.error(`  ✗ Error:`, error.message, '\n');
  }
}

console.log('Done!');

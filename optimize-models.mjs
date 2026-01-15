import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { 
  dedup, 
  prune, 
  quantize, 
  weld,
  flatten,
  join as joinMeshes,
  simplify
} from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
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
  const outputPath = filePath.replace('/original/', '/');
  
  console.log(`Processing: ${fileName}`);
  
  try {
    // Get original file size
    const originalSize = statSync(filePath).size;
    console.log(`  Original size: ${(originalSize / 1024).toFixed(2)} KB`);
    
    // Load the GLB
    const document = await io.read(filePath);
    
    // Apply optimizations (NO DRACO - it doesn't work on iOS)
    await document.transform(
      // Remove duplicate vertex/texture data
      dedup(),
      
      // Weld duplicate vertices
      weld({ tolerance: 0.0001 }),
      
      // Join compatible meshes
      joinMeshes(),
      
      // Flatten scene graph where possible
      flatten(),
      
      // Simplify geometry (reduce polygon count)
      simplify({ 
        simplifier: MeshoptSimplifier,
        ratio: 0.75, // Keep 75% of triangles - more aggressive
        error: 0.001 
      }),
      
      // Quantize vertex attributes (reduces precision, smaller files)
      quantize({
        quantizePosition: 12, // Reduced from 14 - more compression
        quantizeNormal: 8,    // Reduced from 10
        quantizeTexcoord: 10, // Reduced from 12
        quantizeColor: 8,
        quantizeGeneric: 10   // Reduced from 12
      }),
      
      // Remove unused nodes, meshes, materials, textures, etc.
      prune()
    );
    
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

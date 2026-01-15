const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Remove glb/gltf/bin from sourceExts if present (to avoid conflicts)
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  ext => ext !== 'glb' && ext !== 'gltf' && ext !== 'bin'
);

// Add glb/gltf/bin and image extensions to asset extensions for 3D model loading and textures
config.resolver.assetExts = [
  ...config.resolver.assetExts.filter(ext => ext !== 'jpg' && ext !== 'jpeg'), // Remove if present
  'glb', 
  'gltf', 
  'bin',
  'jpg',
  'jpeg'
];

module.exports = config;

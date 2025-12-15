const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Remove glb/gltf/bin from sourceExts if present (to avoid conflicts)
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  ext => ext !== 'glb' && ext !== 'gltf' && ext !== 'bin'
);

// Add glb/gltf/bin to asset extensions for 3D model loading
config.resolver.assetExts = [...config.resolver.assetExts, 'glb', 'gltf', 'bin'];

module.exports = config;

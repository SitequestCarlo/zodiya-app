const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Remove glb/gltf from sourceExts if present (to avoid conflicts)
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  ext => ext !== 'glb' && ext !== 'gltf'
);

// Add glb/gltf to asset extensions
config.resolver.assetExts = [...config.resolver.assetExts, 'glb', 'gltf'];

module.exports = config;

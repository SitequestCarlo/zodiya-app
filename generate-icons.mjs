import sharp from 'sharp';
import { readFileSync } from 'fs';

function createRoundedMask(width, height, radius) {
  const svg = `
    <svg width="${width}" height="${height}">
      <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="white"/>
    </svg>
  `;
  return Buffer.from(svg);
}

async function generateIcons() {
  console.log('Generating app icons from SVG files...\n');

  const iconSvg = readFileSync('./assets/Zodiya-Icon.svg');
  const fullSvg = readFileSync('./assets/Zodiya-Full.svg');

  // 1. App Icon (1024x1024) - from Icon SVG
  console.log('Generating icon.png (1024x1024)...');
  const iconBase = await sharp(iconSvg)
    .resize(900, 900, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({
      top: 62,
      bottom: 62,
      left: 62,
      right: 62,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toBuffer();
  
  await sharp(iconBase)
    .composite([{
      input: createRoundedMask(1024, 1024, 230),
      blend: 'dest-in'
    }])
    .png()
    .toFile('./assets/icon.png');
  console.log('✓ Created icon.png');

  // 2. Adaptive Icon (1024x1024) - from Icon SVG
  console.log('Generating adaptive-icon.png (1024x1024)...');
  await sharp(iconBase)
    .composite([{
      input: createRoundedMask(1024, 1024, 230),
      blend: 'dest-in'
    }])
    .png()
    .toFile('./assets/adaptive-icon.png');
  console.log('✓ Created adaptive-icon.png');

  // 3. Favicon (192x192) - from Icon SVG
  console.log('Generating favicon.png (192x192)...');
  const faviconBase = await sharp(iconSvg)
    .resize(168, 168, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({
      top: 12,
      bottom: 12,
      left: 12,
      right: 12,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toBuffer();
  
  await sharp(faviconBase)
    .composite([{
      input: createRoundedMask(192, 192, 42),
      blend: 'dest-in'
    }])
    .png()
    .toFile('./assets/favicon.png');
  console.log('✓ Created favicon.png');

  // 4. PWA Icon 192 (192x192) - from Icon SVG
  console.log('Generating icon-192.png (192x192)...');
  await sharp(faviconBase)
    .composite([{
      input: createRoundedMask(192, 192, 42),
      blend: 'dest-in'
    }])
    .png()
    .toFile('./assets/icon-192.png');
  console.log('✓ Created icon-192.png');

  // 5. PWA Icon 512 (512x512) - from Icon SVG
  console.log('Generating icon-512.png (512x512)...');
  const icon512Base = await sharp(iconSvg)
    .resize(450, 450, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({
      top: 31,
      bottom: 31,
      left: 31,
      right: 31,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toBuffer();
  
  await sharp(icon512Base)
    .composite([{
      input: createRoundedMask(512, 512, 115),
      blend: 'dest-in'
    }])
    .png()
    .toFile('./assets/icon-512.png');
  console.log('✓ Created icon-512.png');

  // 6. Splash Screen (1284x2778) - from Full SVG
  console.log('Generating splash-icon.png (1284x2778)...');
  const splashBase = await sharp(fullSvg)
    .resize(1150, 2500, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({
      top: 139,
      bottom: 139,
      left: 67,
      right: 67,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toBuffer();
  
  await sharp(splashBase)
    .composite([{
      input: createRoundedMask(1284, 2778, 230),
      blend: 'dest-in'
    }])
    .png()
    .toFile('./assets/splash-icon.png');
  console.log('✓ Created splash-icon.png');

  console.log('\n✅ All icons generated successfully!');
  console.log('\nGenerated files:');
  console.log('  - icon.png (1024x1024) - App icon');
  console.log('  - adaptive-icon.png (1024x1024) - Android adaptive icon');
  console.log('  - favicon.png (192x192) - Web favicon');
  console.log('  - icon-192.png (192x192) - PWA icon');
  console.log('  - icon-512.png (512x512) - PWA icon');
  console.log('  - splash-icon.png (1284x2778) - Splash screen');
}

generateIcons().catch(console.error);

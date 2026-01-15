import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function WebStyleFix() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Inject CSS to remove shadows from SVG and React Native Web generated classes
      const style = document.createElement('style');
      style.id = 'web-shadow-fix';
      style.textContent = `
        /* Force remove shadows from SVG elements */
        svg, svg * {
          box-shadow: none !important;
          filter: none !important;
          -webkit-box-shadow: none !important;
          -webkit-filter: none !important;
        }
        /* Override React Native Web generated shadow classes */
        [class*="boxShadow"],
        [class*="r-boxShadow"] {
          box-shadow: none !important;
          -webkit-box-shadow: none !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        // Cleanup on unmount
        const existingStyle = document.getElementById('web-shadow-fix');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, []);

  return null;
}

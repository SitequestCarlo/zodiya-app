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
        /* Override all React Native Web generated classes that start with r- */
        [class*="r-"] {
          box-shadow: none !important;
          -webkit-box-shadow: none !important;
        }
      `;
      document.head.appendChild(style);

      // Additionally, scan and remove box-shadow from all elements periodically
      const removeBoxShadows = () => {
        const elements = document.querySelectorAll('[class*="r-"]');
        elements.forEach((el) => {
          if (el instanceof HTMLElement) {
            const computedStyle = window.getComputedStyle(el);
            if (computedStyle.boxShadow && computedStyle.boxShadow !== 'none') {
              el.style.boxShadow = 'none';
            }
          }
        });
      };

      // Initial cleanup
      removeBoxShadows();

      // Watch for DOM changes and remove box-shadows from new elements
      const observer = new MutationObserver(() => {
        removeBoxShadows();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => {
        // Cleanup on unmount
        const existingStyle = document.getElementById('web-shadow-fix');
        if (existingStyle) {
          existingStyle.remove();
        }
        observer.disconnect();
      };
    }
  }, []);

  return null;
}

declare module 'astronomia';
declare module 'astronomia/*';

// SVG imports - react-native-svg-transformer
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

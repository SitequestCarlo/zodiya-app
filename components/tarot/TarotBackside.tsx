import React from 'react';
import Svg, { G, Path, Rect } from 'react-native-svg';

interface TarotBacksideProps {
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
}

export default function TarotBackside({
  width = 140,
  height = 222,
  color = 'white',
  backgroundColor = 'black',
}: TarotBacksideProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 976.71 1551.78"
      fill="none"
      // @ts-ignore - web-specific styling to remove shadows
      style={{
        boxShadow: 'none',
        filter: 'none',
        WebkitBoxShadow: 'none',
        WebkitFilter: 'none',
      }}
    >
      {/* Background */}
      <Rect x="0" y="0" width="976.71" height="1551.78" fill={backgroundColor} />
      <G>
        {/* Star burst pattern */}
        <Path
          d="M473.28,211.45l39.22,158.26,129.18-76.58-71.11,139.18,140.37,48.2-140.36,45.04,71.11,140.25-129.09-79.54-39.33,159.13-44.03-157.01-126.22,77.44,71.09-140.25-142.22-45.04,142.19-48.16-74.81-139.22,130.96,77.45c10.79-52.62,28.71-103.34,39.35-155.99.66-3.25-1.28-3.65,3.69-3.15Z"
          fill={color}
        />
        {/* Moon shape */}
        <Path
          d="M435.67,890.2c-112.54,173.4,41.38,413.23,200.06,298.95l31.96-28.89c-19.48,74.54-70.42,133.09-132.78,147.89-197.19,46.79-301.84-274.61-141-398.94,5.81-4.49,37.55-25.09,41.76-19.01Z"
          fill={color}
        />
        {/* Outer frame */}
        <Path
          d="M0,1551.78V9.02L9.21,0h958.29l9.21,9.02v1533.74l-9.21,9.02H0ZM958.29,12.03H21.5l-9.21,9.02v1509.68l9.21,9.02h936.79V12.03Z"
          fill={color}
        />
        {/* Inner frame */}
        <Path
          d="M51.58,1486.62V58.45l8.3-8.35h863.07l8.3,8.35v1419.82l-8.3,8.35H51.58ZM914.65,61.23H70.94l-8.3,8.35v1397.55l8.3,8.35h843.71V61.23Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}

import React, { useRef, useCallback, useEffect } from 'react';
import { Platform, View } from 'react-native';
import WheelPicker from 'react-native-wheely';

interface CustomWheelPickerProps {
  selectedIndex: number;
  options: string[];
  onChange: (index: number) => void;
  itemHeight?: number;
  visibleRest?: number;
  decelerationRate?: 'normal' | 'fast';
  containerStyle?: object;
  itemTextStyle?: object;
  selectedIndicatorStyle?: object;
}

export default function CustomWheelPicker({
  selectedIndex,
  options,
  onChange,
  itemHeight = 50,
  visibleRest = 2,
  decelerationRate = 'fast',
  containerStyle,
  itemTextStyle,
  selectedIndicatorStyle,
}: CustomWheelPickerProps) {
  const containerRef = useRef<View>(null);
  const lastWheelTime = useRef(0);
  const wheelDebounceMs = 100; // Debounce wheel events

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastWheelTime.current < wheelDebounceMs) {
        return;
      }
      lastWheelTime.current = now;

      const direction = e.deltaY > 0 ? 1 : -1;
      const newIndex = Math.max(0, Math.min(options.length - 1, selectedIndex + direction));
      
      if (newIndex !== selectedIndex) {
        onChange(newIndex);
      }
    },
    [selectedIndex, options.length, onChange]
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Get the DOM element for the container
    const element = containerRef.current as unknown as HTMLElement;
    if (!element) return;

    // Find the actual DOM node
    const domNode = element as HTMLElement;
    if (!domNode || !domNode.addEventListener) return;

    domNode.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      domNode.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  if (Platform.OS === 'web') {
    return (
      <View
        ref={containerRef}
        style={containerStyle}
      >
        <WheelPicker
          selectedIndex={selectedIndex}
          options={options}
          onChange={onChange}
          itemHeight={itemHeight}
          visibleRest={visibleRest}
          decelerationRate={decelerationRate}
          containerStyle={containerStyle}
          itemTextStyle={itemTextStyle}
          selectedIndicatorStyle={selectedIndicatorStyle}
        />
      </View>
    );
  }

  return (
    <WheelPicker
      selectedIndex={selectedIndex}
      options={options}
      onChange={onChange}
      itemHeight={itemHeight}
      visibleRest={visibleRest}
      decelerationRate={decelerationRate}
      containerStyle={containerStyle}
      itemTextStyle={itemTextStyle}
      selectedIndicatorStyle={selectedIndicatorStyle}
    />
  );
}

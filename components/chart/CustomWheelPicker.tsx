import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Platform, View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

// Web-specific picker component
function WebWheelPicker({
  selectedIndex,
  options,
  onChange,
  itemHeight = 50,
  visibleRest = 2,
  itemTextStyle,
  selectedIndicatorStyle,
}: CustomWheelPickerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastWheelTime = useRef(0);
  const wheelDebounceMs = 100;

  const totalHeight = itemHeight * (visibleRest * 2 + 1);
  const paddingItems = visibleRest;

  // Scroll to selected item on mount and when selectedIndex changes externally
  useEffect(() => {
    if (scrollViewRef.current && !isScrolling) {
      const yOffset = selectedIndex * itemHeight;
      scrollViewRef.current.scrollTo({ y: yOffset, animated: false });
    }
  }, [selectedIndex, itemHeight, isScrolling]);

  const handleWheel = useCallback(
    (e: Event) => {
      const wheelEvent = e as WheelEvent;
      wheelEvent.preventDefault();
      wheelEvent.stopPropagation();

      const now = Date.now();
      if (now - lastWheelTime.current < wheelDebounceMs) {
        return;
      }
      lastWheelTime.current = now;

      const direction = wheelEvent.deltaY > 0 ? 1 : -1;
      const newIndex = Math.max(0, Math.min(options.length - 1, selectedIndex + direction));
      
      if (newIndex !== selectedIndex) {
        onChange(newIndex);
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: newIndex * itemHeight, animated: true });
        }
      }
    },
    [selectedIndex, options.length, onChange, itemHeight]
  );

  const handleScroll = useCallback(
    (event: any) => {
      setIsScrolling(true);
      const yOffset = event.nativeEvent.contentOffset.y;
      const index = Math.round(yOffset / itemHeight);
      const clampedIndex = Math.max(0, Math.min(options.length - 1, index));

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
        if (clampedIndex !== selectedIndex) {
          onChange(clampedIndex);
        }
        // Snap to the nearest item
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: clampedIndex * itemHeight, animated: true });
        }
      }, 250);
    },
    [itemHeight, options.length, onChange, selectedIndex]
  );

  const handleItemPress = useCallback(
    (index: number) => {
      onChange(index);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: index * itemHeight, animated: true });
      }
    },
    [onChange, itemHeight]
  );

  useEffect(() => {
    const scrollView = scrollViewRef.current as any;
    if (!scrollView) return;

    // Access the native DOM element
    const element = scrollView.getScrollableNode?.() || scrollView;
    
    if (element && element.addEventListener) {
      element.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        element.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);

  const paddedOptions = [
    ...Array(paddingItems).fill(''),
    ...options,
    ...Array(paddingItems).fill(''),
  ];

  return (
    <View style={[webStyles.container, { height: totalHeight }]}>
      <View
        style={[
          webStyles.selectedIndicator,
          selectedIndicatorStyle,
          { height: itemHeight, top: visibleRest * itemHeight },
        ]}
      />
      <ScrollView
        ref={scrollViewRef}
        style={webStyles.scrollView}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={32}
      >
        {paddedOptions.map((option, index) => {
          const actualIndex = index - paddingItems;
          const isSelected = actualIndex === selectedIndex;
          const isPadding = index < paddingItems || index >= paddingItems + options.length;

          return (
            <TouchableOpacity
              key={`${option}-${index}`}
              onPress={() => !isPadding && handleItemPress(actualIndex)}
              disabled={isPadding}
              style={[webStyles.item, { height: itemHeight }]}
            >
              <Text
                style={[
                  webStyles.itemText,
                  itemTextStyle,
                  isSelected && webStyles.selectedText,
                  isPadding && webStyles.hiddenText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const webStyles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    zIndex: 1,
    pointerEvents: 'none',
    marginHorizontal: 8,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 18,
    color: '#666',
  },
  selectedText: {
    color: '#000',
    fontWeight: '600',
  },
  hiddenText: {
    opacity: 0,
  },
});

export default function CustomWheelPicker(props: CustomWheelPickerProps) {
  if (Platform.OS === 'web') {
    return <WebWheelPicker {...props} />;
  }

  return (
    <WheelPicker
      selectedIndex={props.selectedIndex}
      options={props.options}
      onChange={props.onChange}
      itemHeight={props.itemHeight}
      visibleRest={props.visibleRest}
      decelerationRate={props.decelerationRate}
      containerStyle={props.containerStyle}
      itemTextStyle={props.itemTextStyle}
      selectedIndicatorStyle={props.selectedIndicatorStyle}
    />
  );
}

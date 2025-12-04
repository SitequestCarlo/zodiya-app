import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WheelPicker from 'react-native-wheely';

// Generate picker options
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

interface TimeStepProps {
  selectedHour: number;
  selectedMinute: number;
  onHourChange: (index: number) => void;
  onMinuteChange: (index: number) => void;
}

export { HOURS, MINUTES };

export default function TimeStep({
  selectedHour,
  selectedMinute,
  onHourChange,
  onMinuteChange,
}: TimeStepProps) {
  return (
    <View style={styles.pickerContainer}>
      <View style={styles.timePickerRow}>
        <View style={styles.pickerWrapperLarge}>
          <Text style={styles.pickerLabel}>Stunde</Text>
          <WheelPicker
            selectedIndex={selectedHour}
            options={HOURS}
            onChange={onHourChange}
            itemHeight={50}
            visibleRest={2}
            decelerationRate="fast"
            containerStyle={styles.wheelPicker}
            itemTextStyle={styles.wheelText}
            selectedIndicatorStyle={styles.selectedIndicator}
          />
        </View>
        <Text style={styles.timeSeparator}>:</Text>
        <View style={styles.pickerWrapperLarge}>
          <Text style={styles.pickerLabel}>Minute</Text>
          <WheelPicker
            selectedIndex={selectedMinute}
            options={MINUTES}
            onChange={onMinuteChange}
            itemHeight={50}
            visibleRest={2}
            decelerationRate="fast"
            containerStyle={styles.wheelPicker}
            itemTextStyle={styles.wheelText}
            selectedIndicatorStyle={styles.selectedIndicator}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  pickerWrapperLarge: {
    width: 80,
    alignItems: 'center',
  },
  pickerLabel: {
    fontFamily: 'CinzelDecorative_400Regular',
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  wheelPicker: {
    width: '100%',
    height: 250,
  },
  wheelText: {
    fontFamily: 'CinzelDecorative_400Regular',
    fontSize: 18,
    color: '#000',
  },
  selectedIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  timeSeparator: {
    fontFamily: 'CinzelDecorative_700Bold',
    fontSize: 24,
    color: '#000',
    marginHorizontal: 8,
    marginTop: 20,
  },
});

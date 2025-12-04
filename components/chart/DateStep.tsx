import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import CustomWheelPicker from './CustomWheelPicker';

// Generate picker options
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 120 }, (_, i) => String(CURRENT_YEAR - i));

interface DateStepProps {
  selectedDay: number;
  selectedMonth: number;
  selectedYear: number;
  onDayChange: (index: number) => void;
  onMonthChange: (index: number) => void;
  onYearChange: (index: number) => void;
}

export { DAYS, MONTHS, YEARS };

export default function DateStep({
  selectedDay,
  selectedMonth,
  selectedYear,
  onDayChange,
  onMonthChange,
  onYearChange,
}: DateStepProps) {
  return (
    <View style={styles.pickerContainer}>
      <View style={styles.datePickerRow}>
        <View style={styles.pickerWrapperSmall}>
          <Text style={styles.pickerLabel}>Tag</Text>
          <CustomWheelPicker
            selectedIndex={selectedDay}
            options={DAYS}
            onChange={onDayChange}
            itemHeight={50}
            visibleRest={2}
            decelerationRate="fast"
            containerStyle={styles.wheelPicker}
            itemTextStyle={styles.wheelText}
            selectedIndicatorStyle={styles.selectedIndicator}
          />
        </View>
        <View style={styles.pickerWrapperMonth}>
          <Text style={styles.pickerLabel}>Monat</Text>
          <CustomWheelPicker
            selectedIndex={selectedMonth}
            options={MONTHS}
            onChange={onMonthChange}
            itemHeight={50}
            visibleRest={2}
            decelerationRate="fast"
            containerStyle={styles.wheelPicker}
            itemTextStyle={styles.wheelText}
            selectedIndicatorStyle={styles.selectedIndicator}
          />
        </View>
        <View style={styles.pickerWrapperSmall}>
          <Text style={styles.pickerLabel}>Jahr</Text>
          <CustomWheelPicker
            selectedIndex={selectedYear}
            options={YEARS}
            onChange={onYearChange}
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
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  pickerWrapperSmall: {
    width: 80,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  pickerWrapperMonth: {
    width: 140,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  pickerLabel: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: 'CinzelDecorative_400Regular',
    }),
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  wheelPicker: {
    width: '100%',
    height: 250,
  },
  wheelText: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: 'CinzelDecorative_400Regular',
    }),
    fontSize: 18,
    color: '#000',
  },
  selectedIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
});

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export interface PlaceSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface PlaceStepProps {
  birthPlace: string;
  placeSuggestions: PlaceSuggestion[];
  selectedPlace: PlaceSuggestion | null;
  isSearching: boolean;
  onPlaceChange: (text: string) => void;
  onSelectPlace: (place: PlaceSuggestion) => void;
}

export default function PlaceStep({
  birthPlace,
  placeSuggestions,
  selectedPlace,
  isSearching,
  onPlaceChange,
  onSelectPlace,
}: PlaceStepProps) {
  return (
    <View style={styles.placeContainer}>
      <TextInput
        style={styles.input}
        placeholder="Stadt eingeben..."
        placeholderTextColor="#777"
        value={birthPlace}
        onChangeText={onPlaceChange}
        autoCapitalize="words"
      />
      
      {isSearching && (
        <View style={styles.searchingContainer}>
          <ActivityIndicator size="small" color="#000" />
          <Text style={styles.searchingText}>Suche...</Text>
        </View>
      )}
      
      {placeSuggestions.length > 0 && !selectedPlace && (
        <FlatList
          data={placeSuggestions}
          keyExtractor={(item, index) => `${item.lat}-${item.lon}-${index}`}
          style={styles.suggestionsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => onSelectPlace(item)}
            >
              <Text style={styles.suggestionText} numberOfLines={2}>
                {item.display_name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
      
      {selectedPlace && (
        <View style={styles.selectedPlaceContainer}>
          <Text style={styles.selectedPlaceLabel}>Ausgewählt:</Text>
          <Text style={styles.selectedPlaceText} numberOfLines={2}>
            {selectedPlace.display_name}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  placeContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#000',
    fontSize: 16,
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: 'CinzelDecorative_400Regular',
    }),
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  searchingText: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: 'CinzelDecorative_400Regular',
    }),
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  suggestionsList: {
    maxHeight: 200,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
  },
  suggestionItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: 'CinzelDecorative_400Regular',
    }),
    fontSize: 14,
    color: '#000',
  },
  selectedPlaceContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
  },
  selectedPlaceLabel: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: 'CinzelDecorative_700Bold',
    }),
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: Platform.select({ web: '600', default: undefined }),
  },
  selectedPlaceText: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: 'CinzelDecorative_400Regular',
    }),
    fontSize: 14,
    color: '#000',
  },
});

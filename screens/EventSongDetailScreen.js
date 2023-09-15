// Import necessary modules
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView} from 'react-native';
import { WebView } from 'react-native-webview';

// Define your EventSongDetailScreen component
function EventSongDetailScreen({ route }) {
  const [searchResults, setSearchResults] = useState([]);
  
  const song = route.params.song;
  const uri = song.songInfoURL ? song.songInfoURL : `https://en.wikipedia.org/wiki/${song.name}_(${song.composer})`;
  

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: uri }}
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});


export default EventSongDetailScreen;

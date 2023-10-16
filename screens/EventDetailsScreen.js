import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

const EventDetailsScreen = ({ navigation, route }) => {
  const [eventDetails, setEventDetails] = useState(null);
  const user = auth.currentUser;
  const { eventID } = route.params;

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log("Events detail::::", eventDetails)
  // }, [eventDetails]);

  const fetchData = async () => {
    const eventRef = doc(db, 'events', eventID);
    const eventDoc = await getDoc(eventRef);

    if (eventDoc.exists()) {
      const eventData = eventDoc.data();

      // Fetch songs data
      const songsCollectionRef = collection(db, 'events', eventID, 'songs');
      const songsSnapshot = await getDocs(songsCollectionRef);
      const songsData = songsSnapshot.docs.map((songDoc) => songDoc.data());

      // Update the event details state
      setEventDetails({ ...eventData, songsData });
    } else {
      console.log('Event not found.');
    }
  };

  const renderItem = () => {
    if (eventDetails) {
      return (
        <View style={styles.item}>
          <Text style={styles.locationTitle}>{eventDetails.volunteerGroupName}</Text>
          <Text style={styles.dateSubtitle}>Date:</Text>
          <Text style={styles.dateInfo}>
            {eventDetails.dateTime.toDate().toLocaleString([], {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          <Text style={styles.songsTitle}>Songs:</Text>
          <View style={styles.songsContainer}>
            {eventDetails.songsData.map((song, index) => (
              <TouchableOpacity onPress={() => navigation.navigate("Song Information", { song: song })} key={index}>
                <View style={styles.songBox}>
                  <Text style={styles.songText}>{song.name}, {song.composer}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else {
      return <Text>Loading...</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[eventDetails]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    
  },
  locationTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  dateSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
  dateInfo: {
    fontSize: 18,
    marginBottom: 10,
    color: '#444',
  },
  songsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
  songsContainer: {
    marginTop: 10,
  },
  songBox: {
    backgroundColor: '#f8f2ff', 
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  songText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

const EventDetailsScreen = ({navigation, route }) => {
  const [eventDetails, setEventDetails] = useState(null);
  const user = auth.currentUser;
  const { eventID } = route.params;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Events detail::::", eventDetails)
  }, [eventDetails]);

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
          <Text style={styles.label}>{eventDetails.volunteerGroupName}</Text>
          <Text style={styles.subLabel}>Date:</Text>
          <Text style={styles.info}>
            {eventDetails.dateTime.toDate().toLocaleString([], {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          <Text style={styles.subLabel}>Location:</Text>
          <Text style={styles.info}>{eventDetails.communityName}</Text>
          <Text style={styles.subLabel}>Songs:</Text>
          <View style={styles.songsContainer}>
            {eventDetails.songsData.map((song, index) => 
            <TouchableOpacity onPress={()=>navigation.navigate("Song Details",{song:song})}>
              <Text key={index} style={styles.songName}>{song.name}, {song.composer}</Text>
              </TouchableOpacity>
            )}
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
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    //backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  songsContainer: {
    marginTop: 5,
  },
  songName: {
    fontSize: 14,
    marginBottom: 3,
    color: '#333',
  },

})

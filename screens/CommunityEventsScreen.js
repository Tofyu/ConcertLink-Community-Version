import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, FlatList, SafeAreaView } from 'react-native';
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Avatar, Card, IconButton, Button } from 'react-native-paper';

const CommunityEventsScreen = ({ navigation }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [communityUser, setCommunityUser] = useState()
  const user = auth.currentUser;

  const getCommunityGroupID = async () => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    let groupID = '';

    if (docSnap.exists()) {
      groupID = docSnap.data().communityID;
      setCommunityUser(docSnap.data().name)
    } else {
      console.log('No such document!');
    }

    return groupID;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let eventsFromDB = [];
    const groupID = await getCommunityGroupID();
    const eventsQuery = query(collection(db, 'events'), where('communityID', '==', groupID));
    const querySnapshot = await getDocs(eventsQuery);
    const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
    for (const docSnap of docsData) {
      if (docSnap.communityID === groupID) {
        const songsCollectionRef = collection(db, 'events', docSnap.id, 'songs');
        const songsSnapshot = await getDocs(songsCollectionRef);
        const songsData = songsSnapshot.docs.map((songDoc) => songDoc.data());
  
        eventsFromDB.push({ id: docSnap.id, ...docSnap, songsData });
      }
    }
  
    const sortedData = eventsFromDB.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  
    const currentDateTime = new Date();
    const upcoming = [];
    const past = [];
  
    for (const event of sortedData) {
      const eventDateTime = event.dateTime.toDate();  

      if (eventDateTime <= currentDateTime) {
        past.push(event);
      } else {
        upcoming.push(event);
      }
    }
  
    const sortedUpcoming = upcoming.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    const sortedPast = past.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  
    setUpcomingEvents(sortedUpcoming);
    setPastEvents(sortedPast);
  };
  

  const renderItem = ({ item }) => {
    const currentDateTime = new Date();
    const eventDateTime = item.dateTime.toDate();
    let buttonToRender;

    if (eventDateTime <= currentDateTime) {
      buttonToRender = (
        <Button onPress={() => navigation.navigate('Feedback', { eventID: item.id })}>
          Send Feedback
        </Button>
      );
    } else {
      buttonToRender = (
        <Button onPress={() => navigation.navigate('Event Details', { eventID: item.id })}>
          Event Details
        </Button>
      );
    }

    return (
      <Card>
        <Card.Title
          title={item.volunteerGroupName}
          subtitle={eventDateTime.toLocaleString([], {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        />
        <Card.Actions>{buttonToRender}</Card.Actions>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Welcome Text */}
      <Text style={styles.welcomeText}>Welcome, {communityUser}!</Text>
      
      <Button onPress={() => navigation.navigate('Community Register')}>
          Register Your Community
        </Button>
      
      {/* Upcoming Events */}
      <FlatList
        data={upcomingEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Button>Upcoming Events</Button>}
      />
      
      {/* Past Events */}
      <FlatList
        data={pastEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Button>Past Events</Button>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default CommunityEventsScreen;

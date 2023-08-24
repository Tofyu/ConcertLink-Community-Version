import { StyleSheet, View, FlatList, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getDocs, query, collection, where, doc, getDoc } from 'firebase/firestore'
import { db, auth} from '../firebase'
import { Text, Button } from 'react-native-paper';

const CommunityManagerHomeScreen = ({navigation}) => {
  const [events, setEvents] = useState([])

  const user = auth.currentUser;
 

const getCommunityGroupID = async () => {
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  let groupID = ""
  if (docSnap.exists()) {
    groupID = docSnap.data().communityID
  } else {
    console.log("No such document!");
  }
  console.log("Group Id::", groupID)
  return groupID
}

  

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    console.log(events)
  }, [events])

  const fetchData = async () => {
    try {
      // Get the community ID from the Promise returned by getCommunityGroupID
      const communityID = await getCommunityGroupID();
  
      // Now that you have the communityID, you can use it in the query
      const eventsFromDB = [];
      const querySnapshot = await getDocs(
        query(collection(db, "events"), where('communityID', '==', communityID))
      );
  
      querySnapshot.forEach((doc) => {
        eventsFromDB.push({ ...doc.data(), id: doc.id });
      });
  
      setEvents(eventsFromDB);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const renderItem = ({item}) => (
    <View>
      <Text variant = 'bodyMedium'>{item.dateTime.toDate().toDateString()}</Text>
    </View>
  )
return (
    <SafeAreaView>
      <View>

        <Text variant = 'titleMedium'>Upcoming Events</Text>
        <FlatList data={events.filter((item) => item.status == "accepted" && item.dateTime.toDate() >= Date.now())} renderItem={renderItem} />

        <Text variant = 'titleMedium'>Unconfirmed Events</Text>
        <FlatList data={events.filter((item) => item.status == "requested")} renderItem={renderItem} />
        
        <Button mode = "elevated" onPress={() => {}}>Edit Profile</Button>
        <Button mode="elevated" onPress={() => {}}>Set Event</Button>
        <Button mode="elevated" onPress={() => {navigation.navigate("Manage Users")}}>Manage Users</Button>
      </View>
    </SafeAreaView>
  )
}

export default CommunityManagerHomeScreen

const styles = StyleSheet.create({})

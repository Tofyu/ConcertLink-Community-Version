import { StyleSheet, View, FlatList, SafeAreaView, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getDocs, query, collection, where, doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { Text, Button, Appbar, AnimatedFAB, Card, Avatar } from 'react-native-paper';

const CommunityManagerHomeScreen = ({ animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode, navigation }) => {
  const [isExtended, setIsExtended] = React.useState(true);
  const [events, setEvents] = useState([])
  const [isManager, setIsManager] = useState(false)
  const [communityID, setCommunityID] = useState("")


  const isIOS = Platform.OS === 'ios';

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = { [animateFrom]: 16 };



  const user = auth.currentUser;


  const getCommunityGroupID = async () => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    let groupID = '';

    if (docSnap.exists()) {
      if(docSnap.data().isManager)
      {
        groupID = docSnap.data().communityID;
        setIsManager(true)
        setCommunityID(groupID)
      }
      
    } else {
      console.log('No such document!');
    }

    return groupID;
  };


  useEffect(() => {
    // Add a navigation listener to re-fetch data when the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, [navigation]);

  // useEffect(() => {
  //   // console.log("Group ID", groupID)
  //   console.log("Events:::::::",events)
  // }, [events])

  const fetchData = async () => {
    const groupID = await getCommunityGroupID();
    if (groupID) {
      try {
        // Now that you have the communityID, you can use it in the query

        console.log("FetchData-GroupID:::", groupID)
        const eventsFromDB = [];
        const querySnapshot = await getDocs(
          query(collection(db, "events"), where('communityID', '==', groupID))
        );

        querySnapshot.forEach((doc) => {
        eventsFromDB.push({ ...doc.data(), id: doc.id });
        });

        setEvents(eventsFromDB);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <Card>
      <Card.Title
        title={item.volunteerGroupName}
        subtitle={item.dateTime.toDate().toDateString()}
      />
    </Card>
  )

  
  return (

    <SafeAreaView style={styles.container}>
      {!isManager ? (
  <View style={{ backgroundColor: 'white', padding: 10 }}>
    <Text>You don't have access to this page</Text>
    <Button onPress={() => navigation.navigate('Community Events')} >Back to Home</Button>
  </View>
) : (
      <>
        <Appbar.Header>
          <Appbar.Content title="Manager Home" />
          <Appbar.Action
            icon="account-edit"
            Text="Edit"
            onPress={() => {
              navigation.navigate("Community Profile", { groupID: communityID });
            }} />
          <Appbar.Action
            icon="account-group"
            Text="Manage Users"
            onPress={() => {
              navigation.navigate("Manage Users", { groupID: communityID });
            }} />
        </Appbar.Header>

        <Text variant="titleMedium">Upcoming Events</Text>
        <FlatList
          data={events.filter((item) => item.status === "accepted" && item.dateTime.toDate() >= Date.now())}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <Text>There are no upcoming events</Text>
            </View>
          )} />
      <ScrollView onScroll={onScroll}>
        <Text variant="titleMedium">Unconfirmed Events</Text>
        {events
          .filter((item) => item.status === "requested")
          .map((item) => (
            <Card key={item.id}>
              <Card.Title
                title={item.volunteerGroupName}
                subtitle={item.dateTime.toDate().toDateString()}
              />
            </Card>
          ))}
        {events.filter((item) => item.status === "requested").length === 0 && (
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text>There are no unconfirmed events</Text>
          </View>
        )}
      </ScrollView>

      <AnimatedFAB
        icon={'plus'}
        label={'Add Event   '}
        extended={isExtended}
        onPress={() => navigation.navigate('Event Request',{ communityID: communityID })}
        visible={visible}
        animateFrom={'right'}
        iconMode={'static'}
        style={[styles.fabStyle, style, fabStyle]} />
    </>
    )}
    </SafeAreaView>
  );


}

export default CommunityManagerHomeScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    margin: 10,
    backgroundColor: 'white'
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
  },
});
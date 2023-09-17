import { StyleSheet, View, FlatList, SafeAreaView, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getDocs, query, collection, where, doc, getDoc } from 'firebase/firestore'
import { db, auth} from '../firebase'
import { Text, Button, Appbar, AnimatedFAB, Card, Avatar } from 'react-native-paper';

const CommunityManagerHomeScreen = ({animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode,navigation}) => {
  const [isExtended, setIsExtended] = React.useState(true);
  const [events, setEvents] = useState([])


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
      groupID = docSnap.data().communityID;
      setCommunityUser(docSnap.data().name)
    } else {
      console.log('No such document!');
    }

    return groupID;
  };

  

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    console.log(events)
  }, [events])

  const fetchData = async () => {
      getCommunityGroupID()
      if(groupID)
      {

      try {
        
    
        // Now that you have the communityID, you can use it in the query
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

  const renderItem = ({item}) => (
    <Card>
      <Card.Title
        title={item.volunteerGroupName}
        subtitle={item.dateTime.toDate().toDateString()}
      />
    </Card>  
   
  )

  const renderContent = () => {
    //To Restrict access to non-manager
    if (!groupID) {
      return (
        <View style={{ backgroundColor: 'white', padding: 10 }}>
          <Text>You don't have access to this page</Text>
          <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
        </View>
      );
    }
    return (
      <View>
        
      </View>
    );

  }

  return (
    
    <SafeAreaView style={styles.container}>
      <ScrollView onScroll={onScroll}>
      {!groupID ? (
        <View style={{ backgroundColor: 'white', padding: 10 }}>
          <Text>You don't have access to this page</Text>
          <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
        </View>
      ) : (<View>
            <Appbar.Header>
              <Appbar.Content title="Manager Home" />
              <Appbar.Action
                icon="account-edit"
                Text="Edit"
                onPress={() => {
                  navigation.navigate("Community Profile", { groupID: groupID });
                } } />
              <Appbar.Action
                icon="account-group"
                Text="Manage Users"
                onPress={() => {
                  navigation.navigate("Manage Users", { groupID: groupID });
                } } />
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

            <Text variant="titleMedium">Unconfirmed Events</Text>
            <FlatList
              data={events.filter((item) => item.status === "requested")}
              renderItem={renderItem}
              ListEmptyComponent={() => (
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Text>There are no unconfirmed events</Text>
                </View>
              )} />
              </View>
      )}
          </ScrollView>
          <AnimatedFAB
              icon={'plus'}
              label={'Add Event   '}
              extended={isExtended}
              onPress={() => navigation.navigate('Event Request')}
              visible={visible}
              animateFrom={'right'}
              iconMode={'static'}
              style={[styles.fabStyle, style, fabStyle]} />      
    </SafeAreaView>
  );


}

export default CommunityManagerHomeScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    margin:10,
    backgroundColor:'white'
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
  },
});
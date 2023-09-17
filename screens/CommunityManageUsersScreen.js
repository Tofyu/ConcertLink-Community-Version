import {
  Text, StyleSheet, View, FlatList, ImageBackground, TouchableOpacity, StyleProp,
  ViewStyle,
  Animated,
  Platform,
  ScrollView,
  SafeAreaView,
  I18nManager
} from 'react-native'
import React, { useState, useEffect } from "react";
import { doc, getDocs, addDoc, collection, deleteDoc, query, where } from "firebase/firestore";
import { db } from '../firebase';
import { Ionicons } from "@expo/vector-icons";
import { TextInput, Card, Button, AnimatedFAB } from 'react-native-paper';

const CommunityManageUserScreen = ({ navigation, route,
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode,
}) => {
  const [isExtended, setIsExtended] = React.useState(true);
  const [users, setUsers] = useState("");
  const isIOS = Platform.OS === 'ios';

  const { groupID } = route.params
  console.log("Group ID::::::", groupID)

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = { [animateFrom]: 16 };


  const fetchData = async () => {
    const eventsQuery = query(collection(db, 'users'), where('communityID', '==', groupID));
    const querySnapshot = await getDocs(eventsQuery);
    const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name, email: doc.data().email, phone: doc.data().phone, birthday: doc.data().birthday }));
    setUsers(docsData);

  }

  useEffect(() => {
    // Add a navigation listener to re-fetch data when the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    console.log("*********", users)
  })

  const deleteItem = async (id) => {
    try {
      // Reference the document in the Firestore collection
      const userRef = doc(db,  "users", id);

      // Delete the document from Firestore
      await deleteDoc(userRef);

      // After successful deletion, update the state to reflect the changes
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={{margin:5}}>
      <Card.Title title={item.name} />
  <Card.Content>
    <Text>Email: {item.email}</Text>
    <Text>Phone: {item.phone}</Text>
    <Text>Birth day: {item.birthday}</Text>
  </Card.Content>
     
      <Card.Actions>
        <Button
          onPress={() => deleteItem(item.id)}
          mode="elevated"
          buttonColor="lavender" >Delete</Button>
      </Card.Actions>
    </Card>
  );

  return (

    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Users</Text>

      <FlatList
        onScroll={onScroll}
        data={users}
        renderItem={renderItem}
      />

      <AnimatedFAB
        icon={'plus'}
        label={'Add User    '}
        extended={isExtended}
        onPress={() => navigation.navigate("Add Users",{communityID:groupID})}
        visible={visible}
        animateFrom={'right'}
        iconMode={'static'}
        style={[styles.fabStyle, style, fabStyle]}
      />

    </SafeAreaView>
  )
}

export default CommunityManageUserScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    margin:10,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 2,
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15
  },
  text1: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    justifyContent: 'center'
  }
})

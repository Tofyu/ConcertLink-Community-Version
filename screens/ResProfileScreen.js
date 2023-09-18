import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { TextInput, Button } from 'react-native-paper';
import { collection, getDoc, updateDoc, doc, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase';
import { Picker } from '@react-native-picker/picker'; // Import Picker from the new package

const ResProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({})
  const [name, setName] = useState()
  const [birthDate, setBirth] = useState()
  const [communityName, setCommunityName] = useState()
  const [phone, setPhone] = useState()
  const [email, setEmail] = useState()
  const [communities, setCommunities] = useState([])
  const [selectedCommunity, setSelectedCommunity] = useState()
  const userid = auth.currentUser;



  useEffect(() => {
    //get community list for picker
    const fetchCommunities = async () => {
      console.log("Fetch data")
      const querySnapshot = await getDocs(collection(db, "communities"));
      const communityList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("List", communityList)
      setCommunities(communityList);
    };

    //Read user information
    const fetchUserData = async () => {
      const docRef = doc(db, "users", userid.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser(docSnap.data());
        setBirth(docSnap.data().birthDate.toDate().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }))
        console.log("Document data:", docSnap.data());
        setSelectedCommunity[docSnap.data().communityID]
      } else {
        console.log("No such document!");
      }
    };

    fetchCommunities();
    fetchUserData();

  }, []);

  const save = async () => {
    const userRef = doc(db, "users", userid.uid);

    try {
      const docRef = await updateDoc(userRef, {
        name: name || "",
        birthDate: birthDate || "",
        phone: phone || "",
        email: email || "",
        communityID: selectedCommunity.ID || "",
        communityName: selectedCommunity.name || ""
      });
      console.log("Profile changed")
      navigation.navigate("Community Events")
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Resident Profile</Text>

      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={user.name ? user.name : "Name"}
      />



      <TextInput
        style={styles.input}
        placeholder={birthDate}
        onChangeText={setBirth}
        value={birthDate}
      />

      <TextInput
        style={styles.input}
        placeholder={user.phone}
        onChangeText={setPhone}
        value={phone}
      />

      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={user.email ? user.email : "Enter email"}
      />
      <Picker
        selectedValue={selectedCommunity ? selectedCommunity.id : ''}
        onValueChange={(itemValue, itemIndex) => {
          const selectedCommunityObject = communities.find((community) => community.id === itemValue);
          setSelectedCommunity(selectedCommunityObject);
        }}
      >
        <Picker.Item label="Select a community" value="" />
        {communities.map((community) => (
          <Picker.Item key={community.id} label={community.name} value={community.id} />
        ))}
      </Picker>

      <Button onPress={save}> Save </Button>

    </SafeAreaView>
  )
}

export default ResProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 2,
    paddingTop: 15,
    paddingBottom: 15
  },
  input: {
    height: 40,
    width: 300,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: 'rgba(39, 213, 245, 0.8)',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#fff',
  },
});
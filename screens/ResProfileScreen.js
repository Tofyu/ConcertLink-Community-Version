import { StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native'
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
      // console.log("List", communityList)
      setCommunities(communityList);
    };

    //Read user information
    const fetchUserData = async () => {
      const docRef = doc(db, "users", userid.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const user = docSnap.data()
        setUser(user);
        setName(user.name)
        setEmail(user.emial || 'Enter Email')
        setPhone(user.phone || 'Enter phone')
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

  const deleteAccount = async () => {
    // Show an alert to confirm account deletion
    Alert.alert(
      'Confirm Account Deletion',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            // Delete the user's account in Firebase Authentication
            try {
              await auth.currentUser.delete();
              console.log('User account deleted successfully.');
              // Navigate to the login screen or any other appropriate screen after deletion
              navigation.navigate('Login'); // Change 'Login' to the desired screen
            } catch (error) {
              console.error('Error deleting user account:', error.message);
              // Handle the error, display an error message, or provide user feedback
            }
          },
          style: 'destructive', // The button is styled to indicate a destructive action
        },
      ],
      { cancelable: true } // Allow the user to tap outside the alert to dismiss it
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Resident Profile</Text>

      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
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
        value={email}
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
      <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
        <Button onPress={save} mode="elevated"> Save </Button>
        <Button onPress={deleteAccount} mode="contained">

          Delete Account
        </Button>
      </View>


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
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
});
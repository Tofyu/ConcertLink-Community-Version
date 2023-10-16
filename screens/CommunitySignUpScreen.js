import { StyleSheet, View, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { TextInput, Button, Text } from 'react-native-paper';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from '../firebase'
import { addDoc, collection, setDoc, doc, getDocs } from "firebase/firestore";
import { Picker } from '@react-native-picker/picker'; // Import Picker from the new package
import DateTimePicker from '@react-native-community/datetimepicker';



const CommunitySignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [birthDate, setBirthDate] = useState(new Date(1950, 0, 1))
  const [communities, setCommunities] = useState([])
  const [selectedCommunity, setSelectedCommunity] = useState()
  const [showPicker, setShowPicker] = useState(false);


  //Create an account
  const signUpUser = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        //console.log("User created", user)
        addUser(user.uid)
        navigation.navigate("Login")
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  useEffect(() => {
    const fetchCommunities = async () => {
      console.log("Fetch data")
      const querySnapshot = await getDocs(collection(db, "communities"));
      const communityList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //console.log("List", communityList)
      setCommunities(communityList);
    };

    fetchCommunities();
  }, []);

  // useEffect(() => {
  //   console.log("Community list", communities)
  // }, [communities])


  //Add an user in users collection
  const addUser = async (id) => {
    try {
      const userDocRef = doc(db, "users", id);
      let userCommunityID = null;
      let userCommunityName = null;

      if (selectedCommunity) {
        userCommunityID = selectedCommunity.id;
        userCommunityName = selectedCommunity.name;
      }


      await setDoc(userDocRef, {
        name: name,
        phone: phone,
        birthDate: birthDate,
        email: email,
        communityID: userCommunityID,
        communityName: userCommunityName
      });

      console.log("Document written with ID: ", id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowPicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
  };

  return (
    <SafeAreaView>
      <View style={{ margin: 10, justifyContent: 'space-around' }}>
        <Text variant="titleLarge">Sign Up</Text>
        <View style={{ marginVertical: 40, justifyContent: 'space-around' }}>
          <TextInput label="Email" value={email} mode="outlined" onChangeText={text => setEmail(text)} style={{ marginBottom: 10 }} autoCapitalize='none'/>
          <TextInput label="Password" value={password} onChangeText={text => setPassword(text)} secureTextEntry={true} mode="outlined" style={{ marginBottom: 10 }} autoCapitalize='none'/>
          <TextInput label="Full Name" value={name} onChangeText={text => setName(text)} mode="outlined" style={{ marginBottom: 10 }} />
          <TextInput label="Phone" value={phone} mode="outlined" onChangeText={text => setPhone(text)} style={{ marginBottom: 10 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="titleMedium">Date of birth</Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={birthDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          </View>
          {/* <TextInput label="Day of birth(mm/dd/yyyy)" value={birthDate} onChangeText={text => setBirthDate(text)} mode ="outlined" style={{ marginBottom: 10 }} /> */}
        </View>
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
        <Button icon="content-save-check" mode="elevated" onPress={signUpUser} style={{ marginVertical: 10 }}>
          Sign Up
        </Button>
        <Button icon="login" mode="elevated" onPress={() => { navigation.navigate('Login') }}>
          Go to Login
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default CommunitySignUpScreen

const styles = StyleSheet.create({})
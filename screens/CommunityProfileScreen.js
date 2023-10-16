import { Text, StyleSheet,  View, ImageBackground, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from "react";
import {  doc, getDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { Button, TextInput, Card, IconButton } from 'react-native-paper';

const CommunityProfileScreen = ({ navigation, route }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [phone, setPhone] = useState("");
    const [zip, setZip] = useState("");
    const [size, setSize] = useState(0);
    const [description, setDescription] = useState("");


    const {groupID} = route.params

  useEffect(async()=> {
    const docRef = doc(db, "communities", groupID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const community = docSnap.data()
        setName(community.name)
        setEmail(community.email)
        setAddress(community.address)
        setCity(community.city)
        setState(community.state)
        setPhone(community.phone)
        setZip(community.zip)
        setSize(community.size)
        setDescription(community.description)
    // console.log("Document data:", docSnap.data());
    } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    }
  }, [])

  // useEffect(() => {
  //   console.log("community: " + name + "\n")
  // })

const save = async() => {
  const commRef = doc(db, "communities", groupID);

// Set the "capital" field of the city 'DC'
await updateDoc(commRef, {
  email: email||"",
  description: description||"",
  address: address||"",
  city: city||"",
  state: state||"",
  phone: phone||"",
  zip: zip||"",
  size: size||0
})
.then(() => { console.log("Document successfully updated!"); }) 
 .catch((error) => {console.error("Error updating document: ", error); });
}
  
  
  
  

  return (
    <SafeAreaView>

    <Card>
      
      <Card.Title
      title = {name}
      />

      <Card.Content>
        <TextInput
        placeholder="Enter New Email"
        onChangeText={setEmail}
        value={email}
        />



        <TextInput
        placeholder="Enter new description"
        onChangeText={setDescription}
        value={description}
        />
        


        <TextInput
        placeholder="Enter new address"
        onChangeText={setAddress}
        value={address}
        />
        


        <TextInput
        placeholder="Enter new city"
        onChangeText={setCity}
        value={city}
        />
        


        <TextInput
        placeholder="Enter new state"
        onChangeText={setState}
        value={state}
        />
        


        <TextInput
        placeholder="Enter new phone number"
        onChangeText={setPhone}
        value={phone}
        />
        


        <TextInput
        placeholder="Enter new zip number"
        onChangeText={setZip}
        value={zip}
        />
        


        <TextInput
        placeholder="Enter new size"
        onChangeText={setSize}
        value={size}
        />

      </Card.Content>

      <Card.Actions>

        <Button 
          mode="elevated"
          buttonColor = "lavender" 
          onPress={save} 
        >Save</Button>

      </Card.Actions>
      
    </Card>
    </SafeAreaView>
  )
}

export default CommunityProfileScreen

const styles = StyleSheet.create({
  title:{
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 2,
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15
  },
  text1:{
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    justifyContent: 'center'
  }
})

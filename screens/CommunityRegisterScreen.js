import { StyleSheet, View, ImageBackground, SafeAreaView, ScrollView } from 'react-native'
import { Button, Input } from "@rneui/themed";
import React, { useState, useEffect } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';

const CommunityRegisterScreen = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [size, setSize] = useState(0);
  const [description, setDescription] = useState("");
  const { userID } = route.params


  const Register = async ({}) => {

    try {
      //1. register community
      const docRef = await addDoc(collection(db, "communities"), {
        name: name,
        email: email,
        description: description,
        address: address,
        city: city,
        state: state,
        phone: phone,
        zip: zip,
        size: size
      });
      console.log("Document written with ID: ", docRef.id);

      //2. update user with the community
      const userDocRef = doc(db, 'users', userID);

      // Update the user document with the new values
      updateDoc(userDocRef, {
        communityID: docRef.id,
        communityName: name,
        isManager: true,
      })
        .then(() => {
          console.log('User document updated successfully');
        })
        .catch((error) => {
          console.error('Error updating user document:', error);
        });

      navigation.navigate("Community Events")
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }


  return (


    <SafeAreaView style={{}}>
      <ScrollView>
        <Input
          placeholder="Enter your group's name"
          leftIcon={{ type: "material", name: "groups" }}
          styles={styles}
          label="Name"
          onChangeText={setName}
          inputStyle={{ fontSize: 15, /* other styles here */ }}
        />

        <Input
          placeholder="Enter your group's email"
          leftIcon={{ type: "material", name: "email" }}
          styles={styles}
          label="Email"
          onChangeText={setEmail}
          inputStyle={{ fontSize: 15, /* other styles here */ }}
        />

        <Input
          placeholder="Enter your group's address"
          leftIcon={{ type: "material", name: "place" }}
          styles={styles}
          label="Address"
          onChangeText={setAddress}
          inputStyle={{ fontSize: 15, /* other styles here */ }}
        />

        <Input
          placeholder="Enter your group's city"
          leftIcon={{ type: "material", name: "festival" }}
          styles={styles}
          label="City"
          onChangeText={setCity}
          inputStyle={{ fontSize: 15, /* other styles here */ }}
        />

        <Input
          placeholder="Enter your group's state"
          leftIcon={{ type: "material", name: "landscape" }}
          styles={styles}
          label="State"
          onChangeText={setState}
          inputStyle={{ fontSize: 15, /* other styles here */ }}
        />

        <Input
          placeholder="Enter your group's phone number"
          leftIcon={{ type: "material", name: "phone" }}
          styles={styles}
          label="Phone"
          onChangeText={setPhone}
          inputStyle={{ fontSize: 15, /* other styles here */ }}
        />

        <Input
          placeholder="Enter your zip code"
          leftIcon={{ type: "material", name: "apartment" }}
          styles={styles}
          label="Zip"
          onChangeText={setZip}
          inputStyle={{ fontSize: 15, /* other styles here */ }}
        />

        <Input
          placeholder="Enter your group's size"
          leftIcon={{ type: "material", name: "groups" }}
          styles={styles}
          label="Size"
          onChangeText={setSize}
          inputStyle={{ fontSize: 15, /* other styles here */ }}
        />

        <Input
          placeholder="Enter your group's description"
          leftIcon={{ type: "material", name: "description" }}
          styles={styles}
          label="Description"
          onChangeText={setDescription}
          inputStyle={{ fontSize: 15, /* other styles here */ }}
        />


        <View style={{ alignItems: 'center' }}>
          <Button
            title="Register Group"
            type="outline"
            buttonStyle={{ borderColor: 'rgba(39, 213, 245, 0.8)', backgroundColor: 'rgba(209, 248, 255, 0.8)', borderRadius: 15, borderWidth: 2 }}
            titleStyle={{ color: 'rgba(39, 213, 245, 0.8)', fontWeight: 'bold', fontSize: 25 }}
            onPress={Register}
            style={{ padding: 10, width: 350 }} />




          <Button
            title="Move to Home"
            buttonStyle={{ backgroundColor: 'rgba(39, 213, 245, 0.8)', borderRadius: 15 }}
            titleStyle={{ fontWeight: 'bold', fontSize: 25 }}
            icon={{ name: 'arrow-right', type: 'font-awesome', size: 20, color: 'white', }}
            onPress={() => navigation.navigate('Community Events')}
            style={{ padding: 10, width: 350, marginVertical: 5 }} />
        </View>
      </ScrollView>
    </SafeAreaView>


  )
}

export default CommunityRegisterScreen

const styles = StyleSheet.create({})

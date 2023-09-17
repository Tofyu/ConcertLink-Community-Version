import { StyleSheet,  SafeAreaView, View } from 'react-native'
import React, { useState, useEffect } from "react";
import {  addDoc, collection, doc } from "firebase/firestore";
import { db } from '../firebase';
import { Button, TextInput, Card, IconButton, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const CommunityAddUserScreen = ({route, navigation}) => {
    const {user, communityID} = route.params
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [birthday, setBirthday] = useState(new Date(1950, 0, 1));
    const [showPicker, setShowPicker] = useState(false);
    
    useEffect(() => {
      console.log("*********" , user)
    },[])

  const AddUser = async ()=>{
    try {
      const docRef = collection(db, "users");
      addDoc(docRef,{
        communityID: communityID,
        name: name,
        email: email,
        phone: phone,
        birthDate: birthday
      });
      console.log("Document written with ID: ", docRef.id);
      navigation.navigate("Manager Home")
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setShowPicker(Platform.OS === 'ios');
    setBirthday(currentDate);
  };



  return (
    
    <SafeAreaView>
      <View style={{justifyContent:'space-around'}}>
      <Text variant="titleLarge">Add User</Text>   
      <View style={{margin:20}}>
      <TextInput
        placeholder = "Enter your user's name"
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter your user's email"
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter your user's phone number"
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />

<View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text variant="titleMedium">Date of birth</Text> 
                <DateTimePicker
                testID="dateTimePicker"
                value={birthday}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onDateChange}
            />
            </View>

            </View>
        
      <Button 
      mode="elevated"
      buttonColor = "lavender"
      onPress={AddUser}
      style={{margin:40}}
      >Confirm</Button>


</View>
    </SafeAreaView>
    
  )
}

export default CommunityAddUserScreen

const styles = StyleSheet.create({
  input:{ backgroundColor: 'white', paddingHorizontal: 10, }
})
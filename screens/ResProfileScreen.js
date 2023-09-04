import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { TextInput, Button } from 'react-native-paper';
import { collection, getDoc, updateDoc, doc } from "firebase/firestore";
import { db, auth } from '../firebase';

const ResProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({})
  const [name, setName] = useState()
  const [birthDate, setBirth] = useState()
  const [communityName, setCommunityName] = useState()
  const [phone, setPhone] = useState()
  const [email, setEmail] = useState()
  const userid = auth.currentUser;

  const fetchData = async () => {
    const docRef = doc(db, "users", userid.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser(docSnap.data());
      setBirth(docSnap.data().birthDate.toDate().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }))
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  const save = async () => {
    try {
      const docRef = await updateDoc(collection(db, "users"), {
        name: name,
        birthDate: birthDate,
        phone: phone,
        email: email
      });
      
      navigation.navigate("Community Events")
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Resident Profile</Text>

      <Text style = {styles.text}> Name </Text>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={user.name? user.name:"Enter name"}
      />

      <Text style = {styles.text}> Community </Text>
      <TextInput
        style={styles.input}
        placeholder={user.communityName}
        value={communityName}
      />

      <Text style = {styles.text}> Birthday </Text>
      <TextInput
        style={styles.input}
        onChangeText={setBirth}
        value={user.birthDate? user.birthDate:"Enter birth date"}
      />

<Text style = {styles.text}> Phone </Text>
      <TextInput
        style={styles.input}
        onChangeText={setPhone}
        value={user.phone? user.phone:"Enter phone"}
      />

<Text style = {styles.text}> Email </Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={user.email? user.email:"Enter email"}/>

      <Button onPress={save}> Save </Button>

    </SafeAreaView>
  )
}

export default ResProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 2,
    paddingTop: 15,
    paddingBottom: 15
  },
  text: {
    fontSize: 15,
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

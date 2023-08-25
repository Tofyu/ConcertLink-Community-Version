import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Button, Input } from "@rneui/themed";
import { collection, getDoc, updateDoc, doc } from "firebase/firestore";
import { db, auth } from '../firebase';

const VolProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({})
  const [name, setName] = useState()
  const [grade, setGrade] = useState()
  const [school, setSchool] = useState()
  const [instrument, setInstrument] = useState()
  const [volunteerGroup, setGroup] = useState()
  const [phone, setPhone] = useState()
  const [email, setEmail] = useState()
  const userid = auth.currentUser;

  const fetchData = async () => {
    const docRef = doc(db, "volunteers", userid.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser(docSnap.data());
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
      const docRef = await updateDoc(collection(db, "volunteers", userid.uid), {
        name: name,
        grade: grade,
        school: school,
        instrument: instrument,
        phone: phone,
        email: email

      });

      navigation.navigate("Volunteer Events")

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Volunteer Profile</Text>

      <Input
        style={styles.input}
        placeholder={user.name}
        onChangeText={setName}
        value={name}
      />

      <Input
        style={styles.input}
        placeholder={user.grade}
        onChangeText={setGrade}
        value={grade}
      />

      <Input
        style={styles.input}
        placeholder={user.school}
        onChangeText={setSchool}
        value={school}
      />

      <Input
        style={styles.input}
        placeholder={user.instrument}
        onChangeText={setInstrument}
        value={instrument}
      />

      <Input
        style={styles.input}
        placeholder={user.volunteerGroup}
        value={volunteerGroup}
      />

      <Input
        style={styles.input}
        placeholder={user.phone}
        onChangeText={setPhone}
        value={phone}
      />

      <Input
        style={styles.input}
        placeholder={user.email}
        onChangeText={setEmail}
        value={email}
      />

      <Button
        title="Save"
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        onPress={save}
      />
    </View>
  )
}

export default VolProfileScreen

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
    backgroundColor: '#27D5F5',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
  },
});

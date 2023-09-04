import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import { TextInput, Button } from 'react-native-paper';
import React, { useState } from 'react'
import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../firebase';

const ResFeedbackScreen = ({ route, navigation }) => {
  const [comments, setComments] = useState('')
  const { eventID } = route.params;

  const send = async () => {
    try {
      const docRef = await addDoc(collection(db, "events", eventID, 'feedback'), {
        comments: comments,
        userID: "userID"
      });

      navigation.navigate("Community Events")
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder='Give us your feedback!'
          multiline={true} // Allow multiple lines
          numberOfLines={10} // Set the initial number of lines
          
          onChangeText={comments => setComments(comments)}
        />
       <Button onPress={send} style={styles.sendButton} labelStyle={styles.sendButtonText}>
  Send
</Button>
    </SafeAreaView>
  );
}

export default ResFeedbackScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
  },
  inputContainer: {
    flexDirection: 'column', // Stack items vertically
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    height: 400, // Increase the height as needed
    width: '100%', // Take up the entire width
    marginVertical: 8, // Separate from the button
  },
  sendButton: {
    backgroundColor: '#9370DB', // Light purple color
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8, // Separation from the input
  },
  sendButtonText: {
    color: 'white', // White text color
  }
  
});

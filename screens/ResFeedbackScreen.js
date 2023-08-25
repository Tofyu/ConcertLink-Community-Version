import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import { TextInput, Button, } from 'react-native-paper';
import React, {useState, useEffect} from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { db } from '../firebase';

const ResFeedbackScreen = ( {route, navigation} ) => {
    const [comments, setComments] = useState('')
    const { eventID } = route.params;

    // const [events, setEvents] = useState([])
    // const [open, setOpen] = useState(false);
    // const [value, setValue] = useState([]);
    

    // const fetchData = async () => {
    //     const querySnapshot = await getDocs(collection(db, "events"));
    //     const docsData = querySnapshot.docs.map((doc) => ({label: doc.data().name, value: doc.id}));
    //     setEvents(docsData);
    //   };
    
    // useEffect(()=>{
    //   fetchData()
    // }, [])
    
 
    const send = async ()=>{
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
                   
          {/* <DropDownPicker
                open={open}
                value={value}
                items={events}
                setOpen={setOpen}
                setValue={setValue}
                // setItems={setItems}
                theme="DARK"
                multiple={false}
                mode="BADGE"
                badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
              />           */}

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder='Give us your feedback!' onChangeText={comments => setComments(comments)} />

          <Button onPress={send}> Send </Button>
          </View>  
        </SafeAreaView>
      );
}

export default ResFeedbackScreen

const styles = StyleSheet.create({
    container: {
        flex: 100,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F5F5F5',
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginBottom: 8,
      },
      input: {
        flex: 30,
        fontSize: 16,
        marginLeft: 8,
        height: 120,
      },
      sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
      },
})

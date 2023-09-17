import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, ImageBackground  } from "react-native";
import { Button, Input } from "@rneui/themed";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const CommunityLogInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false); // State to track login status

  

  //Login function
  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        navigation.navigate("User BottomTab")
        // ...
        setLoginFailed(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        setLoginFailed(true);
      });
    }
  return (
    
    <View style={{marginTop:230}}> 
    {loginFailed && ( // Render the error message when login fails
    <View>
        <Text style={styles.errorText}>Login failed. Please try again.</Text>
        </View>
      )}
      <Input
        placeholder="Enter your email"
        leftIcon={{ type: "material", name: "email" }}
        label="Email"
        onChangeText={setEmail}
      />

      <Input
        placeholder="Enter your password"
        leftIcon={{ type: "material", name: "lock" }}
        label="Password"
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={{alignItems:'center'}}>
        <Button 
        title="Login" 
        buttonStyle={{ backgroundColor: 'rgba(39, 213, 245, 0.8)', borderRadius: 15 }} 
        titleStyle={{ fontWeight: 'bold', fontSize: 25 }} 
        icon={{name: 'sign-in',type: 'font-awesome',size: 20,color: 'white',}}
        onPress={login} 
        style={{ padding: 10, marginVertical: 5, width: 370 }} />

        <Button 
        title="Create Account" 
        buttonStyle={{backgroundColor: 'rgba(39, 213, 245, 0.8)', borderRadius: 15 }} 
        titleStyle={{ fontWeight: 'bold', fontSize: 25 }} 
        icon={{name: 'user-plus',type: 'font-awesome',size: 20,color: 'white',}}
        onPress={() => navigation.navigate("Register")} 
        style={{padding: 10, width: 370 }} />
      </View>
    </View>
    
  )
}

export default CommunityLogInScreen

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
});
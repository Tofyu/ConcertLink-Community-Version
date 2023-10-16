import React, { useState } from "react";
import { StyleSheet, Text, View, ImageBackground, Image } from "react-native";
import { Button, Input } from "@rneui/themed";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const CommunityLogInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false); // State to track login status

  // Login function
  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        navigation.navigate("User BottomTab");
        setLoginFailed(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        setLoginFailed(true);
      });
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/Concert_Link_Logo.png")}
        style={styles.logo}
      />

      {loginFailed && ( // Render the error message when login fails
        <View>
          <Text style={styles.errorText}>Login failed. Please try again.</Text>
        </View>
      )}

      <Input
        placeholder="Enter your email"
        leftIcon={{ type: "material", name: "email", color:"#6433bd" }}
        label="Email"
        onChangeText={setEmail}
        autoCapitalize='none'
      />

      <Input
        placeholder="Enter your password"
        leftIcon={{ type: "material", name: "lock", color:"#6433bd" }}
        label="Password"
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize='none'
      />

      <View style={{ alignItems: 'center' }}>
        <Button
          title="Login"
          buttonStyle={{ backgroundColor: '#b897f2', borderRadius: 15 }}
          titleStyle={{ fontWeight: 'bold', fontSize: 25 }}
          icon={{ name: 'sign-in', type: 'font-awesome', size: 20, color: 'white' }}
          onPress={login}
          style={{ padding: 10, marginVertical: 5, width: 370 }}
        />

        <Button
          title="Create Account"
          buttonStyle={{ backgroundColor: '#6433bd', borderRadius: 15 }}
          titleStyle={{ fontWeight: 'bold', fontSize: 25 }}
          icon={{ name: 'user-plus', type: 'font-awesome', size: 20, color: 'white' }}
          onPress={() => navigation.navigate("Register")}
          style={{ padding: 10, width: 370 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default CommunityLogInScreen;

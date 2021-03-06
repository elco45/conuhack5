import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import * as firebase from "firebase";

const SignupScreen = props => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupUser = (email, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      // set new user's name to name
      .then(() =>
        firebase.auth().currentUser.updateProfile({
          displayName: name
        })
      )
      .then(() => props.navigation.navigate("Profile"))
      .catch(function(error) {
        // Handling errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == "auth/weak-password") {
          alert("The password is too weak.");
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginModule}>
        <View>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Full Name"
            placeholderTextColor="#D7DBDD"
            onChangeText={name => setName(name)}
          />
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Email"
            placeholderTextColor="#D7DBDD"
            onChangeText={email => setEmail(email)}
          />
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="#D7DBDD"
            onChangeText={password => setPassword(password)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              signupUser(email, password);
            }}
          >
            <Text style={{ fontSize: 20, color: "#ffffff" }}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", marginTop: 15 }}>
          <Text>-- or --</Text>
        </View>

        <View style={styles.signupContainer}>
          <Text>
            Already have an account?{" "}
            <Text
              style={styles.textLink}
              onPress={() => props.navigation.navigate("Login")}
            >
              Log In.
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

SignupScreen.navigationOptions = {
  title: "Sign Up"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  loginContainer: {
    width: "100%",
    minWidth: 400,
    borderWidth: 1,
    borderColor: "black"
  },
  textLink: {
    color: "#49AEB5"
  },
  textInput: {
    width: "100%",
    minWidth: 350,
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: "#D7DBDD",
    marginTop: 10,
    padding: 10
  },
  socialLogin: {
    marginTop: 10
  },
  button: {
    marginTop: 10,
    color: "#fff",
    backgroundColor: "green",
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  signupContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    flexDirection: "row"
  }
});

export default SignupScreen;
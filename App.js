import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { YellowBox } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { MaterialIcons } from '@expo/vector-icons';

import GalleryScreen from './screens/galleryScreen';
import LoginScreen from './screens/loginScreen';
import SelectedImageScreen from './screens/selectedImageScreen';
import SignupScreen from './screens/signupScreen';
import ProfileScreen from './screens/profileScreen';
import PasswordScreen from './screens/passwordScreen';
import QuestionsLevelsScreen from './screens/questionsLevelsScreen';
import QuestionsScreen from './screens/questionsScreen';

import firebase from './config/firebase';
YellowBox.ignoreWarnings(['Setting a timer']);

const App = props => {
  const [signedIn, setSignedIn] = useState(false);

  firebase.auth().onAuthStateChanged(user => {
    if (user != null) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  });

  const SignedOut = createStackNavigator(
    {
      Login: LoginScreen,
      Signup: SignupScreen,
      Password: PasswordScreen
    },
    {
      initialRouteName: 'Login'
    }
  );

  const SignedIn = createBottomTabNavigator(
    {
      Gallery: {
        screen: GalleryScreen,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="explore" size={20} color={tintColor} />
          )
        }
      },
      Levels: {
        screen: QuestionsLevelsScreen,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="question-answer" size={20} color={tintColor} />
          )
        }
      },
      Profile: {
        screen: ProfileScreen,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="account-box" size={20} color={tintColor} />
          )
        }
      }
    },
    {
      tabBarOptions: {
        style: {
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
        }
      }
    }
  );

  const TemporalPaths = createStackNavigator({
    SelectedImage: SelectedImageScreen,
    Questions: QuestionsScreen
  });

  const AppNavigator = createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn
      },
      SignedOut: {
        screen: SignedOut
      },
      TemporalPaths: {
        screen: TemporalPaths
      }
    },
    {
      initialRouteName: signedIn ? 'SignedIn' : 'SignedOut'
    }
  );

  const AppContainer = createAppContainer(AppNavigator);

  return <AppContainer />;
};

export default App;

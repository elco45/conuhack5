import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
import * as firebase from 'firebase';
import '@firebase/firestore';

const firestore = new firebase.firestore();

export default class QuestionsLevelsScreen extends Component {
  state = {
    currentUser: firebase.auth().currentUser,
    loading: false,
    pictures: []
  };

  componentDidMount() {
    this.getPictures();
  }

  getPictures() {
    this.setState({ loading: true });
    const { currentUser } = this.state;
    firestore
      .collection('pictures')
      .where('user', '==', currentUser.uid)
      .get()
      .then(doc => {
        if (doc) {
          const pictures = [];
          doc.forEach(collection => {
            pictures.push({ id: collection.id, ...collection.data() });
          });
          this.setState({
            pictures,
            loading: false
          });
        }
      });
  }

  navigateToQuestions(restriction) {
    const { pictures } = this.state;
    if (pictures.length >= restriction) {
      this.props.navigation.navigate('Questions', {
        pictures: this.shuffleArray(pictures).slice(0, 3)
      });
    }
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  render() {
    const { loading, pictures } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <TouchableOpacity
            disabled={pictures.length < 3}
            style={{
              ...styles.button,
              ...{ opacity: pictures.length < 3 ? 0.6 : 1 }
            }}
            onPress={() => this.navigateToQuestions(3)}
          >
            <Text style={styles.buttonText}>Level 1</Text>
            {pictures.length < 3 ? (
              <Text style={styles.buttonText}>
                (Unlock with 3 explorations)
              </Text>
            ) : (
              <Text style={styles.buttonText}>Start Challenge!</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={pictures.length < 100}
            style={{
              ...styles.button,
              ...{ opacity: pictures.length < 3 ? 0.6 : 1 }
            }}
            onPress={() => this.navigateToQuestions(100)}
          >
            <Text style={styles.buttonText}>Level 2</Text>
            {pictures.length < 100 && (
              <Text style={styles.buttonText}>
                (Unlock with 100 explorations)
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
        <OrientationLoadingOverlay
          visible={loading}
          color="white"
          indicatorSize="large"
          messageFontSize={24}
          message="Loading..."
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 60
  },
  scrollContainer: {
    flex: 1,
    height: 100,
    backgroundColor: '#fff',
    paddingBottom: 10,
    marginTop: 16
  },
  button: {
    marginTop: 10,
    color: '#fff',
    minHeight: 50,
    backgroundColor: 'blue',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginBottom: 20
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
    flexDirection: 'row'
  }
});

QuestionsLevelsScreen.navigationOptions = {
  title: 'Questions',
  headerLeft: null
};

import React, { Component } from 'react';
import {
  Button,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ModalWithInput from '../components/modalWithInput';
import uuid from 'uuid';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
import * as Speech from 'expo-speech';
import firebase from '../config/firebase';
import '@firebase/firestore';

const firestore = new firebase.firestore();

export default class SelectedImageScreen extends Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.state = {
      uploading: false,
      currentUser: firebase.auth().currentUser,
      showModal: false
    };

    this._toggleModal = this._toggleModal.bind(this);
    this._saveImage = this._saveImage.bind(this);
  }

  _toggleModal() {
    const { showModal } = this.state;
    this.setState({
      showModal: !showModal
    });
  }

  _saveImage = async () => {
    this.setState({ uploading: true });
    const imgUrl = await this._uploadToFirebase();
    await this._saveToFirestore(imgUrl);
  };

  _saveToFirestore = async imgUrl => {
    const { currentUser } = this.state;
    const { navigation } = this.props;
    const word = navigation.getParam('word', null);
    firestore
      .collection('pictures')
      .add({
        user: currentUser.uid,
        imgUrl,
        word: word.fr,
        createdAt: new Date().getDate()
      })
      .then(ref => {
        this._toggleModal();
        navigation.navigate('Gallery');
      })
      .catch(err => {
        alert(err);
      })
      .finally(() => {
        this.setState({ uploading: false });
      });
  };

  _uploadToFirebase = async () => {
    const { navigation } = this.props;
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', navigation.getParam('image', null), true);
      xhr.send(null);
    });
    const ref = firebase
      .storage()
      .ref()
      .child(uuid.v4());
    const snapshot = await ref.put(blob);
    blob.close();
    return await snapshot.ref.getDownloadURL();
  };

  speak(word) {
    Speech.speak(word.fr, { language: 'fr' });
  }

  render() {
    const { navigation } = this.props;
    const { uploading, showModal } = this.state;
    const word = navigation.getParam('word', '');
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text>{word.fr}</Text>
          <TouchableOpacity
            style={styles.audioBtn}
            onPress={() => this.speak(word)}
          >
            <MaterialIcons name="volume-up" size={16} color="black" />
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: navigation.getParam('image', null) }}
          style={{ height: '50%', width: '100%' }}
        />
        <Text>Très bien! </Text>
        <Button onPress={() => this._toggleModal()} title="Save"></Button>
        <ModalWithInput
          visible={showModal}
          toggleModal={this._toggleModal}
          word={word}
          navigation={navigation}
          saveImgFunc={this._saveImage}
        />
        <OrientationLoadingOverlay
          visible={uploading}
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
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%'
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12
  },
  audioBtn: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginLeft: 10
  }
});

SelectedImageScreen.navigationOptions = {
  title: 'SelectedImage',
  headerLeft: null
};

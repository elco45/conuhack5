import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import * as Permissions from 'expo-permissions';
import ObjectDescriptionModal from '../components/objectDescriptionModal';
import firebase from '../config/firebase';
import '@firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Environment from '../config/environment';
import Base64 from 'Base64';
import CardFlip from 'react-native-card-flip';

const firestore = new firebase.firestore();

const dictionary = [
  {
    en: 'Pen',
    fr: 'Un Stylo',
    description:
      'An instrument for writing or drawing with ink, typically consisting of a metal nib or ball, or a nylon tip, fitted into a metal or plastic holder.'
  },
  {
    en: 'Table',
    fr: 'Une Table',
    description:
      'A piece of furniture with a flat top and one or more legs, providing a level surface on which objects may be placed, and that can be used for such purposes as eating, writing, working, or playing games.'
  },
  {
    en: 'Chair',
    fr: 'Une Chaise',
    description:
      'A separate seat for one person, typically with a back and four legs.'
  },
  {
    en: 'Pig',
    fr: 'Un Cochon',
    description:
      'An omnivorous domesticated hoofed mammal with sparse bristly hair and a flat snout for rooting in the soil, kept for its meat.'
  },
  {
    en: 'Floor',
    fr: 'Le Plancher',
    description: 'The lower surface of a room, on which one may walk.'
  }
];

export default class GalleryScreen extends Component {
  _isMounted = false;
  state = {
    showModal: false,
    currentUser: firebase.auth().currentUser,
    pictures: [],
    word: {},
    imgPreviewUrl: ''
  };

  async componentDidMount() {
    this._isMounted = true;
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.AUDIO_RECORDING);

    this.selectRandomWord();
    this.getPictures();
  }

  selectRandomWord = async (reload = false) => {
    if (reload) {
      alert('Reloaded');
    }
    const word = dictionary[Math.floor(Math.random() * dictionary.length)];
    let uploadResponse = await fetch(
      `https://api.shutterstock.com/v2/images/search?query=${word.en}&page=1&per_page=1`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${Environment['SHUTTERSTOCK_TOKEN']}`
        },
        method: 'GET'
      }
    );
    let uploadResponseVal = await uploadResponse.json();
    let imgPreviewUrl = '';
    if (
      uploadResponseVal &&
      uploadResponseVal.data[0] &&
      uploadResponseVal.data[0].assets
    ) {
      imgPreviewUrl = uploadResponseVal.data[0].assets.preview.url;
    }
    this.setState({
      word,
      imgPreviewUrl
    });
  };

  getPictures() {
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
          if (this._isMounted) {
            this.setState({
              pictures
            });
          }
        }
      });
  }

  toggleModal = () => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  };

  render() {
    const { showModal, pictures, word, imgPreviewUrl } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.helpContainer}>
          <Button onPress={this.toggleModal} title="Explore!" />
          <TouchableOpacity onPress={() => this.selectRandomWord(true)}>
            <MaterialCommunityIcons name="reload" size={20} />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {pictures &&
            pictures.map(picture => (
              <CardFlip
                key={picture.id}
                style={styles.pictureWrapper}
                ref={card => (this.card = card)}
              >
                <TouchableOpacity
                  style={{ height: '100%', width: '100%' }}
                  onPress={() => this.card.flip()}
                >
                  <Image
                    source={{ uri: picture.imgUrl }}
                    style={{ height: '100%', width: '100%' }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ height: '100%', width: '100%' }}
                  onPress={() => this.card.flip()}
                >
                  <Text style={{ textAlign: 'center' }}>{picture.word}</Text>
                </TouchableOpacity>
              </CardFlip>
            ))}
        </ScrollView>
        <ObjectDescriptionModal
          visible={showModal}
          toggleModal={this.toggleModal}
          navigation={this.props.navigation}
          word={word}
          imgPreviewUrl={imgPreviewUrl}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 10
  },
  scrollContainer: {
    flex: 1,
    height: 100,
    backgroundColor: '#fff',
    paddingBottom: 10,
    marginTop: 16
  },
  pictureWrapper: {
    height: 200,
    width: '80%',
    marginBottom: 40
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 30
  },

  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50
  },

  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center'
  },

  helpContainer: {
    marginTop: 15,
    paddingBottom: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black'
  }
});

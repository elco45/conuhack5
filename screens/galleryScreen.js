import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import * as Permissions from 'expo-permissions';
import ObjectDescriptionModal from '../components/objectDescriptionModal';
import firebase from '../config/firebase';
import '@firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Environment from '../config/environment';
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
      'A piece of furniture with a flat top and one or more legs, providing a level surface on which objects may be placed.'
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
  },
  {
    en: 'Pencil',
    fr: 'Un Crayon',
    description:
      'An instrument for writing or drawing, consisting of a thin stick of graphite or a similar substance enclosed in a long thin piece of wood or fixed in a metal or plastic case.'
  },
  {
    en: 'Watch',
    fr: 'Un Montre',
    description: "A small timepiece worn typically on a strap on one's wrist."
  },
  {
    en: 'Mouse',
    fr: 'La Souris',
    description: "A small handheld device that is dragged across a flat surface to move the cursor on a computer screen."
  }
];

export default class GalleryScreen extends Component {
  _isMounted = false;
  state = {
    showModal: false,
    currentUser: firebase.auth().currentUser,
    pictures: [],
    word: {},
    imgPreviewUrl: '',
    pic: {}
  };

  async componentDidMount() {
    this._isMounted = true;
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);

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
            pictures.forEach(picture => {
              const dictionaryInfo = this.getWordInfo(picture.word);
              picture.description = dictionaryInfo.description;
              picture.wordEn = dictionaryInfo.en;
            });

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

  getWordInfo = word => {
    const tmp = dictionary.find(({ fr }) => fr === word);
    return tmp;
  };

  render() {
    const { showModal, pictures, word, imgPreviewUrl, pic } = this.state;
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
                ref={card => (pic[picture.id] = card)}
                flipDirection={Math.random() > 0.5 ? 'x' : 'y'}
              >
                <TouchableOpacity
                  style={{ height: '100%', width: '100%' }}
                  onPress={() => pic[picture.id].flip()}
                >
                  <Image
                    source={{ uri: picture.imgUrl }}
                    style={{ height: '100%', width: '100%' }}
                  />
                  <View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        bottom: 0,
                        position: 'absolute',
                        right: 0,
                        marginRight: 20,
                        marginBottom: 20
                      }}
                    >
                      <TouchableOpacity
                        style={{ marginLeft: 10 }}
                        onPress={() =>
                          Alert.alert(
                            'Likes',
                            'Max, Angela, Karl, ... liked this artifact.',
                            [
                              {
                                text: 'OK'
                              }
                            ],
                            { cancelable: false }
                          )
                        }
                      >
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <MaterialCommunityIcons
                            style={{ color: 'red' }}
                            name="heart"
                            size={20}
                          />
                          <Text>{Math.floor(Math.random() * 100 + 1)}</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ marginLeft: 10 }}
                        onPress={() =>
                          Alert.alert(
                            'Comments',
                            'Max:\nThis awesome!\n\nAngela:\nI love it!!!\n\nKarl:\nhahahahaha',
                            [
                              {
                                text: 'OK'
                              }
                            ],
                            { cancelable: false }
                          )
                        }
                      >
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <MaterialCommunityIcons
                            style={{ color: 'blue' }}
                            name="comment"
                            size={20}
                          />
                          <Text>{Math.floor(Math.random() * 30 + 1)}</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{ marginLeft: 10 }}
                        onPress={() =>
                          Alert.alert(
                            'Challenge',
                            'Challenge your friends to find this artifact.',
                            [
                              {
                                text: 'Go'
                              }
                            ],
                            { cancelable: false }
                          )
                        }
                      >
                        <MaterialCommunityIcons name="sword-cross" size={20} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'lightgrey'
                  }}
                  onPress={() => pic[picture.id].flip()}
                >
                  <Text
                    style={{
                      marginTop: 12,
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}
                  >{`${picture.word} - (${picture.wordEn})`}</Text>
                  <Text
                    style={{ marginTop: 12, textAlign: 'center' }}
                  >{`${picture.description}`}</Text>
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

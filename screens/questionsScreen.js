import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from 'react-native';

const QuestionsScreen = props => {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [correctValues, setCorrectValues] = useState([]);
  const [incorrectValues, setIncorrectValues] = useState([]);
  const [pictures, setPictures] = useState(
    props.navigation.getParam('pictures', [])
  );
  const [options, setOptions] = useState(
    Array.from(Array(pictures.length).keys())
  );

  const nextQuestion = option => {
    if (option === questionNumber) {
      const temp = correctValues;
      temp.push(pictures[option].word);
      setCorrectValues(temp);
    } else {
      const temp = incorrectValues;
      temp.push(pictures[option].word);
      setIncorrectValues(temp);
    }
    if (questionNumber + 1 === pictures.length) {
      Alert.alert(
        'Results',
        `Correct values: ${correctValues.length}\nWrong values: ${incorrectValues.length}`,
        [
          {
            text: 'OK'
          }
        ],
        { cancelable: false }
      );
      props.navigation.navigate('Artifacts');
    } else {
      const tmp = shuffleArray(Array.from(Array(pictures.length).keys()));
      setOptions(tmp);
      setQuestionNumber(questionNumber + 1);
    }
  };

  const shuffleArray = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {pictures[questionNumber] && (
          <View key={pictures[questionNumber].id} style={styles.pictureWrapper}>
            <Image
              source={{ uri: pictures[questionNumber].imgUrl }}
              style={{
                height: '100%',
                width: '100%',
                marginBottom: 40,
                borderBottomWidth: 1,
                borderColor: 'black'
              }}
            />
          </View>
        )}
        {options.map(option => (
          <TouchableOpacity
            style={styles.buttonText}
            key={`${pictures[option]}-${option}`}
            onPress={() => nextQuestion(option)}
          >
            <Text style={{ textAlign: 'center', color: 'black' }}>
              {pictures[option].word}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

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
    marginBottom: 20
  },
  buttonText: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    color: '#fff',
    minHeight: 50,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginBottom: 20
  }
});

QuestionsScreen.navigationOptions = {
  title: 'Questions',
  headerLeft: null
};

export default QuestionsScreen;

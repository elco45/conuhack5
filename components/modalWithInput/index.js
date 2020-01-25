import React, { Component } from 'react';
import { Modal, Text, Button, View, TextInput } from 'react-native';

export default class ModalWithInput extends Component {
  state = {
    text: ''
  };

  sealToMemory = async () => {
    if (
      this.props.word &&
      this.state.text.toUpperCase() == this.props.word.fr.toUpperCase()
    ) {
      const { saveImgFunc } = this.props;
      try {
        saveImgFunc();
      } catch (err) {
        alert(err);
      }
    }
  };

  render() {
    const { word, toggleModal, visible } = this.props;
    const { text } = this.state;
    return (
      <Modal animationType="slide" transparent={false} visible={visible}>
        <View style={{ marginTop: 22 }}>
          <View>
            <Text
              style={{ marginBottom: 20, fontSize: 20, fontWeight: 'bold' }}
            >
              {word.fr}
            </Text>
            <Text style={{ marginBottom: 20 }}>
              Type the word in french and seal it into your memory!
            </Text>
            <TextInput
              style={{
                marginBottom: 20,
                backgroundColor: 'lightgray',
                borderColor: 'black'
              }}
              onChangeText={text => this.setState({ text })}
              value={text}
            />
            <Button
              disabled={word && word.fr.toUpperCase() !== text.toUpperCase()}
              onPress={() => this.sealToMemory()}
              title="Save"
            ></Button>
            <Button color="red" onPress={toggleModal} title="Cancel"></Button>
          </View>
        </View>
      </Modal>
    );
  }
}

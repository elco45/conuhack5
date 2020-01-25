import React, { useState } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import Modal, {
  ModalButton,
  ModalContent,
  ModalFooter,
  ModalTitle
} from 'react-native-modals';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Environment from '../../config/environment';
import Base64 from 'Base64';

const ObjectDescriptionModal = props => {
  const [loading, setLoading] = useState(false);
  const [imgUri, setImgUri] = useState('');

  takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true
    });

    if (!pickerResult.cancelled) {
      this.handleImagePicked(pickerResult);
    } else {
      setLoading(false);
    }
  };

  pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!pickerResult.cancelled) {
      this.handleImagePicked(pickerResult);
    } else {
      setLoading(false);
    }
  };

  handleImagePicked = async pickerResult => {
    try {
      setLoading(true);

      if (!pickerResult.cancelled) {
        setImgUri(pickerResult.uri);
        this.submitToGoogle();
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    }
  };

  submitToGoogle = async () => {
    try {
      setLoading(true);
      const base64 = await FileSystem.readAsStringAsync(imgUri, {
        encoding: FileSystem.EncodingType.Base64
      });
      let uploadResponse = await fetch(
        'https://api.shutterstock.com/v2/cv/images',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Basic ${Environment['SHUTTERSTOCK_TOKEN']}`
          },
          method: 'POST',
          body: JSON.stringify({
            base64_image: base64
          })
        }
      );
      let uploadResponseVal = await uploadResponse.json();
      if (uploadResponseVal && uploadResponseVal.upload_id) {
        let keywordResp = await fetch(
          'https://api.shutterstock.com/v2/cv/keywords?asset_id=' +
            uploadResponseVal.upload_id,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Basic ${Environment['SHUTTERSTOCK_TOKEN']}`
            },
            method: 'GET'
          }
        );
        let keywordRespVal = await keywordResp.json();
        if (
          keywordRespVal &&
          keywordRespVal.data &&
          keywordRespVal.data.includes(props.word.en.toLowerCase())
        ) {
          setLoading(false);
          props.toggleModal();
          props.navigation.navigate('SelectedImage', {
            image: imgUri,
            word: props.word
          });
        } else {
          setLoading(false);
          alert('Sorry, try again! That is not the correct item!');
        }
      }
    } catch (error) {
      setLoading(false);
      props.toggleModal();
      alert(error);
    }
  };

  return (
    <View>
      <Modal
        visible={props.visible}
        onTouchOutside={props.toggleModal}
        modalTitle={<ModalTitle title={props.word.fr} align="left" />}
        footer={
          <ModalFooter>
            {!loading ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row'
                }}
              >
                <ModalButton
                  bordered
                  text="Photo"
                  onPress={() => this.takePhoto()}
                  key="button-1"
                />
                <ModalButton
                  bordered
                  text="Gallery"
                  onPress={() => this.pickImage()}
                  key="button-2"
                />
              </View>
            ) : (
              <Text>Loading...</Text>
            )}
          </ModalFooter>
        }
      >
        <ModalContent>
          <View style={styles.pictureWrapper}>
            <Image
              source={{ uri: props.imgPreviewUrl }}
              style={{ height: 100, width: 100 }}
            />
          </View>
          <Text>{props.word.description || ''}</Text>
        </ModalContent>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pictureWrapper: {
    marginBottom: 10,
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default ObjectDescriptionModal;

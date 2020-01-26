import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

export default class RankingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: 40 }}>Current Rank:</Text>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <View style={styles.medalWrapper}>
            <Entypo name="medal" size={70} color="brown" />
            <Text>1</Text>
          </View>

          <View style={styles.medalWrapper}>
            <MaterialCommunityIcons name="medal" size={70} color="green" />
            <Text>2</Text>
          </View>

          <View style={styles.medalWrapper}>
            <Entypo name="medal" size={100} color="purple" />
            <Text>3</Text>
          </View>

          <View style={styles.medalWrapper}>
            <MaterialCommunityIcons name="medal" size={70} color="blue" />
            <Text>4</Text>
          </View>

          <View style={styles.medalWrapper}>
            <Entypo name="medal" size={70} color="red" />
            <Text>5</Text>
          </View>
        </ScrollView>
        <View style={styles.container}>
          <View>
            <View style={styles.medalWrapper}>
              <Entypo name="medal" color="red" size={20} />
              <Text>5 Max</Text>
              <Text style={{ marginLeft: 200 }}>100XP</Text>
            </View>
            <View style={styles.medalWrapper}>
              <Entypo name="medal" color="red" size={20} />
              <Text>5 Angela</Text>
              <Text style={{ marginLeft: 190 }}>90XP</Text>
            </View>
            <View style={styles.medalWrapper}>
              <MaterialCommunityIcons name="medal" color="blue" size={20} />
              <Text>4 Karl</Text>
              <Text style={{ marginLeft: 210 }}>87XP</Text>
            </View>
            <View style={styles.medalWrapper}>
              <Entypo name="medal" color="purple" size={20} />
              <Text>3 James</Text>
              <Text style={{ marginLeft: 190 }}>74XP</Text>
            </View>
            <View style={styles.medalWrapper}>
              <MaterialCommunityIcons name="medal" color="green" size={20} />
              <Text>2 Jay</Text>
              <Text style={{ marginLeft: 210 }}>62XP</Text>
            </View>
            <View style={styles.medalWrapper}>
              <Entypo name="medal" color="brown" size={20} />
              <Text>1 www</Text>
              <Text style={{ marginLeft: 200 }}>26XP</Text>
            </View>
          </View>
        </View>
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
  medalWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10
  }
});

RankingScreen.navigationOptions = {
  title: 'Ranking',
  headerLeft: null
};

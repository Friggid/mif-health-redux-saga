import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, Button, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

class ExerciseComponent extends Component {
  static propTypes = {
    text: PropTypes.string
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('./test.jpg')} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{this.props.text}</Text>
          <TouchableOpacity
            style={styles.loginScreenButton}
            onPress={this.navigateToRegister}
            underlayColor='#fff'>
            <Text style={styles.loginText}>{'Done!'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default ExerciseComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
    marginBottom: 20,
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 }
  },
  textContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 20,
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    color: 'white',
    fontSize: 40
  },
  image: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    zIndex: -1
  },
  loginScreenButton: {
    marginTop: 20,
    marginLeft: 120,
    marginRight: 120,
    backgroundColor:'#2196F3',
    borderRadius:20
  },
  loginText:{
    color:'#fff',
    backgroundColor: 'rgba(0,0,0,0)',
    textAlign:'center',
    paddingLeft : 10,
    paddingRight : 10,
    fontSize: 20,
    fontWeight: '500'
  }
});

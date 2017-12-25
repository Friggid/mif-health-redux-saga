import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { loginWithEmail } from '../state/actions/authActions';
import t from 'tcomb-form-native';
import { Actions as Navigation } from 'react-native-router-flux';
const Form = t.form.Form;

const Email = t.refinement(t.String, email => {
  const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return reg.test(email);
});

const User = t.struct({
  email: Email,
  password: t.String
});

const options = {
  auto: 'placeholders',
  fields: {
    email: {
      autoCapitalize: 'none',
      autoCorrect: false,
      keyboardType: 'email-address'
    },
    password: {
      password: true,
      secureTextEntry: true,
      autoCapitalize: 'none',
      autoCorrect: false
    }
  }
};

class WelcomeScreen extends Component {
  static propTypes = {
    loginWithEmail: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    // REMOVE HARDCODED DETAILS!!!!
    this.state = {
      form: {
        email: 'test2@test.lt',
        password: 'testas1'
      }
    };
  }

  navigateToRegister = () => {
    Navigation.register();
  }

  login = () => {
    const { email, password } = this.state.form;
    if (email && password && email.length > 0 && password.length > 0) {
      this.props.loginWithEmail(email, password, 'login');
    }
  }

  onChange = (form) => {
    this.setState({ form });
  }

  render() {
    return (
      <View style={styles.screen}>
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={styles.titleText}>{'MIF HEALTH'}</Text>
          </View>
          <View style={styles.formContainer}>
            <Form
              type={User}
              options={options}
              value={this.state.form}
              onChange={this.onChange} />
            <View style={styles.loginBtn}>
              <TouchableOpacity
                style={styles.loginScreenButton}
                onPress={this.login}
                underlayColor='#fff'>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.loginScreenButton}
              onPress={this.navigateToRegister}
              underlayColor='#fff'>
              <Text style={styles.loginText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
});

const actionsToProps = {
  loginWithEmail
};

export default connect(mapStateToProps, actionsToProps)(WelcomeScreen);

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    justifyContent: 'center',
    padding: 20
  },
  formContainer: {
    borderWidth: 1,
    borderColor: 'rgba(8,8,8,0.2)',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
    margin: 10,
    padding: 20
  },
  loginBtn: {
    marginBottom: 10
  },
  title: {
    justifyContent: 'center',
    padding: 20
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700'
  },
  loginScreenButton: {
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#2196F3',
    borderRadius:20
  },
  loginText:{
    color:'#fff',
    backgroundColor: 'rgba(0,0,0,0)',
    textAlign:'center',
    paddingLeft : 10,
    paddingRight : 10,
    fontSize: 20
  }
});

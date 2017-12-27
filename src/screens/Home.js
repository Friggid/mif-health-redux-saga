import React, { Component } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, ScrollView } from 'react-native';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { getTodaysWorkout } from '../state/actions/workoutActions';
import { fetchUserWorkout } from '../state/actions/authActions';
import Exercises from './Exercises';
import CalendarStrip from 'react-native-calendar-strip';

class HomeScreen extends Component {
  static propTypes = {
    exercises: PropTypes.array,
    loading: PropTypes.bool,
    fetchUserWorkout: PropTypes.func
  }

  constructor() {
    super();

    this.state = {
      shouldRender: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        shouldRender: true
      });
    }, 3000);
  }

  dateSelected = (date) => {
    const day = date.day();

    if (day) {
      this.props.fetchUserWorkout(day);
    }
  }

  render() {
    console.log('HOME props ', this.props);
    console.log('HOME props ', this.props.loading);
    if (!this.state.shouldRender && this.props.loading) {
      return <ActivityIndicator
        style={styles.loadingIncidator}
        size='large'
        color='#2196F3' />;
    } else {
      return (
        <View style={styles.screen}>
          <CalendarStrip
            calendarAnimation={{ type: 'sequence', duration: 30 }}
            daySelectionAnimation={{
              type: 'background',
              duration: 200,
              highlightColor: 'rgba(255,255,255,0.2)'
            }}
            style={styles.calendarStrip}
            calendarColor={'#2196F3'}
            onDateSelected={this.dateSelected} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}>
            <Exercises exercises={this.props.exercises} loading={this.props.loading}/>
          </ScrollView>
        </View>
      );
    }
  }
}

const actionsToProps = {
  getTodaysWorkout,
  fetchUserWorkout
};

const mapStateToProps = state => ({
  exercises: state.auth.exercises,
  loading: state.auth.loading
});

export default connect(mapStateToProps, actionsToProps)(HomeScreen);

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10
  },
  loadingIncidator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  calendarStrip: {
    height: 100,
    paddingTop: 10
  }
});

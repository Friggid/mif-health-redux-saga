import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  REGISTER_WITH_EMAIL,
  LOGIN_WITH_EMAIL,
  CREATE_USER_DETAILS,
  FETCH_USER_WORKOUT,
  CREATE_USER_WORKOUT
} from '../actions/actionTypes';
import fire from '../config/firebaseConfig';
import { Actions as Navigation } from 'react-native-router-flux';
import * as firebase from 'firebase';

export function* watchSignUpEmailSaga() {
  yield takeLatest(REGISTER_WITH_EMAIL.REQUESTED, registerWithEmail);
  yield takeLatest(CREATE_USER_DETAILS.REQUESTED, createUserDetails);
}

export function* watchLoginEmailSaga() {
  yield takeLatest(LOGIN_WITH_EMAIL.REQUESTED, loginWithEmail);
}

export function* registerWithEmail(action) {
  const { email, password } = action;

  try {
    const { uid } = yield call(fire.auth.createUserWithEmailAndPassword, email, password);

    if (uid) {
      const payload = {
        email,
        password,
        fromWhere: 'register'
      };

      const loginResult = yield call(loginWithEmail, payload);

      if (loginResult) {
        createUserInDb(uid, email);
        yield call(Navigation.registerDetails);
      }
    }
  } catch (e) {
    const { code, message } = e;
    console.log('Error trying to register new account');
    console.log('Error code: ', code);
    console.log('Error message: ', message);
    yield put({ type: REGISTER_WITH_EMAIL.ERROR, message });
  }
}

export function* loginWithEmail(action) {
  const { email, password, fromWhere } = action;
  try {
    const { uid } = yield call(fire.auth.signInWithEmailAndPassword, email, password);
    if (uid) {
      yield put({ type: LOGIN_WITH_EMAIL.SUCCESS, uid, email });
      if (fromWhere === 'register') {
        return true;
      }
      if (fromWhere === 'login') {
        yield call(checkUserDetails, uid);
      }
    }

    yield call(Navigation.home);
    return false;
  } catch (error) {
    console.log('Error in login with email and password: ', email, password, error);
  }
}

export function createUserInDb(uid, email) {
  try {
    firebase.database().ref('users/' + uid).set({ uid, email, type: 'user' });
  } catch (e) {
    console.log('Cannot set new user in database', e);
  }
}

export function* createUserDetails(action) {
  const { height, weight, gender, level, goal, age, activity } = action.details;

  // KNYGA, Dellova, et al. ABC’s of Nutrition and Diet Therapy. 2006
  const bmi = calculateBmi(height, weight);
  const idealWeight = calculateIdealWeight(height, gender);
  const calories = calculateCalories(height, weight, age, gender, activity);
  const state = yield select(state => state.auth);

  const details = {
    bmi,
    idealWeight,
    calories
  };

  try {
    firebase.database().ref('users/' + state.uid).update({
      height, weight, gender, level, activity, goal, age, bmi, idealWeight, calories
    });

    yield put({ type: CREATE_USER_DETAILS.SUCCESS, details });
  } catch (e) {
    console.log('Error working with user details', e);
  } finally {
    yield call(fetchOrCreateWorkout);
  }
}

function calculateBmi(heightString, weightString) {
  const height = Number(heightString) / 100;
  const weight = Number(weightString);

  let bmi = weight / Math.pow(height, 2);
  bmi = parseFloat(bmi).toFixed(1);

  if (bmi < 18.5) {
    return bmi + ' - underweight';
  } else if (bmi >= 18.5 && bmi <=24.9) {
    return bmi + ' - normal';
  } else if (bmi >= 25 && bmi <= 29.9) {
    return bmi + ' - overweight';
  } else {
    return bmi + ' - obese';
  }
}

function calculateIdealWeight(heightString, gender) {
  // FORMULA
  // Men: Ideal Body Weight (kg) = [Height (cm) - 100] - ([Height (cm) - 100] x 10%)
  // Women: Ideal Body Weight (kg) = [Height (cm) - 100] - ([Height (cm) - 100] x 15%)

  const height = Number(heightString);
  let idealWeight;

  if (gender === 'male') {
    idealWeight = (height - 100) - (percentage((height - 100), 10));
  } else {
    idealWeight = (height - 100) - (percentage((height - 100), 15));
  }

  return parseFloat(idealWeight).toFixed(0) + ' kg';
}

function percentage(num, per)
{
  return (num / 100) * per;
}

function calculateCalories(heightString, weightString, age, gender, activity) {
  // FORMULA:
  // MAN 	BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
  // WOMAN BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
  console.log('activity ', activity);

  const height = Number(heightString);
  const weight = Number(weightString);
  let bmr;

  if (gender === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }

  console.log('bmr', bmr);

  switch (activity) {
    case 'no':
      return parseFloat(bmr * 1.2).toFixed(0);
    case 'light':
      return parseFloat(bmr * 1.375).toFixed(0);
    case 'moderate':
      return parseFloat(bmr * 1.55).toFixed(0);
    case 'heavy':
      return parseFloat(bmr * 1.725).toFixed(0);
  }
}

export function* checkUserDetails(uid) {
  const userDetails = yield call(fire.database.read, 'users/' + uid);

  if (userDetails) {
    if (!userDetails.weight ||
      !userDetails.height ||
      !userDetails.goal ||
      !userDetails.level ||
      !userDetails.gender ||
      !userDetails.age)
    {
      yield call(Navigation.registerDetails);
    } else {
      yield call(fetchOrCreateWorkout);
    }
  }
}

export function* fetchOrCreateWorkout() {
  const { uid } = yield select(state => state.auth);

  if (uid) {
    const userDetails = yield call(fire.database.read, 'users/' + uid);
    if (userDetails.workouts) {
      const details = {
        bmi: userDetails.bmi,
        calories: userDetails.calories,
        idealWeight: userDetails.idealWeight
      };

      yield put({ type: CREATE_USER_DETAILS.SUCCESS, details });
      yield put({ type: FETCH_USER_WORKOUT.REQUESTED });
    } else {
      yield put({ type: CREATE_USER_WORKOUT.REQUESTED, details: userDetails });
    }
  }
}

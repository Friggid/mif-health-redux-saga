const createAsyncActionType = type => {
  return {
    REQUESTED: `${type}_REQUESTED`,
    SUCCESS: `${type}_SUCCESS`,
    ERROR: `${type}_ERROR`
  };
};

export const SIGN_UP_EMAIL = createAsyncActionType('SIGN_UP_EMAIL');
export const SIGN_UP_EMAIL_DETAILS = createAsyncActionType('SIGN_UP_EMAIL_DETAILS');
export const LOGIN_EMAIL = createAsyncActionType('LOGIN_EMAIL');
export const LOGIN_ANONYMOUSLY = createAsyncActionType('LOGIN_ANONYMOUSLY');
export const LOGIN_EMAIL_PASSWORD = createAsyncActionType('LOGIN_EMAIL_PASSWORD');
export const CREATE_WORKOUT_DAYS = createAsyncActionType('CREATE_WORKOUT_DAYS');

export const REGISTER_WITH_EMAIL = createAsyncActionType('REGISTER_WITH_EMAIL');
export const LOGIN_WITH_EMAIL = createAsyncActionType('LOGIN_WITH_EMAIL');
export const CREATE_USER_DETAILS = createAsyncActionType('CREATE_USER_DETAILS');

export const FETCH_USER_WORKOUT = createAsyncActionType('FETCH_USER_WORKOUT');
export const CREATE_USER_WORKOUT = createAsyncActionType('CREATE_USER_WORKOUT');
export const GET_TODAYS_WORKOUT = createAsyncActionType('GET_TODAYS_WORKOUT');
export const REGENERATE_WORKOUT = createAsyncActionType('REGENERATE_WORKOUT');
export const REGENERATE_USER_WORKOUT = createAsyncActionType('REGENERATE_USER_WORKOUT');

export const CREATE_EXERCISE = createAsyncActionType('CREATE_EXERCISE');
export const GET_USERS = createAsyncActionType('GET_USERS');
export const DELETE_USER = createAsyncActionType('DELETE_USER');
export const MAKE_ADMIN = createAsyncActionType('MAKE_ADMIN');

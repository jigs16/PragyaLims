import { combineReducers } from 'redux'
import ApplicationReducer from './application'
import AuthReducer from './auth'

export default combineReducers({
  auth: AuthReducer,
  application: ApplicationReducer,
  
})

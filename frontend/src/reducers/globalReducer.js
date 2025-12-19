/* Here, we have created the context and the reducer.
The global context named GlobalContext will be used for passing down
values to child components using context.

The reducer has two action types:
setToken: It is used to set the jwt token in the global state.
setUser: It is used to set the user data in the global state.*/

import { createContext } from "react";

export const GlobalContext = createContext(null);

function globalReducer(state, action) {
  switch (action.type) {
    case "setToken": {
      return {
        ...state,
        token: action.data,
      };
    }
    case "setUser": {
      return {
        ...state,
        user: action.data,
      };
    }
    default:
      return state;
  }
}
export default globalReducer;
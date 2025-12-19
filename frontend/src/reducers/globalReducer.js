/* Here, we have created the context and the reducer.
The global context named GlobalContext will be used for passing down
values to child components using context.

The reducer has two action types:
- setToken: It is used to set the jwt token in the global state.
- setUser: It is used to set the user data in the global state.

Local storage:
- localStorage.setItem("token", action.data)  to save the token in the local storage anytime
the setToken action is dispatched.
- localStorage.setItem("user", JSON.stringify(action.data)) to save the user data in
the local storage anytime the setUser action is dispatched. This data needs to
stringified because local storage can only save strings and the user data is an object.*/

import { createContext } from "react"

export const GlobalContext = createContext(null)

function globalReducer(state, action) {
    switch(action.type) {
        case 'setToken': {
            localStorage.setItem("token", action.data)
            return {
                ...state,
                token: action.data
            }
        }
        case 'setUser': {
            localStorage.setItem("user", action.data)
            return {
                ...state,
                user: action.data
            }
        }
        default:
            return state
    }
}

export default globalReducer
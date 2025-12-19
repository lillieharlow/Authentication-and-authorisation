/* App.js

1. Created an initial state to set the initial values for the token and user.
2. Used the useReducer hook to make use of reducer so that the values in the
context can be accessed and changed from anywhere in the app.
3. Wrapped our app with global context, and passed the store and dispatch
so that the children components have access to both the store for data in
the global state and the dispatch for changing the data in the global state.*/

import { useReducer } from "react";

import UserDetail from "./components/UserDetail";
import UserForm from "./components/UserForm";
import globalReducer, { GlobalContext } from "./reducers/globalReducer";

const initialState = {
    token: "",
    user: {},
};

function App() {
    const [store, dispatch] = useReducer(globalReducer, initialState);

    return (
        <GlobalContext.Provider value={{ store, dispatch }}>
            <UserForm />
            <UserDetail />
        </GlobalContext.Provider>
    );
}

export default App;
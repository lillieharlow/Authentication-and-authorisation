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

/* We are getting the token from the local storage and in
case it does not exist, we set it to an empty string.
We are getting the the user data from the local storage and since,
it was stringified before saving, we need to parse it to
convert the string into an object. And, in case it does not exist,
we set it to an empty object.
*/
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const getStoredUser = () => {
  const raw = localStorage.getItem("user");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (err) {
    // Clear corrupted entry and start clean to avoid repeated parse errors.
    localStorage.removeItem("user");
    return {};
  }
};

const getStoredToken = () => {
  const cookieToken = getCookie("token");
  if (cookieToken) return cookieToken;
  return localStorage.getItem("token") ?? "";
};

const initialState = {
  token: getStoredToken(),
  user: getStoredUser(),
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

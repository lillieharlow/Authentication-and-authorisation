/* UserForm component to capture username and password:
1. dispatch from global context so the inputted data can be used
to change the global state.
2. Two states, username and password, to save the inputted username
and password.
3. Two functions, onChangeUsername and onChangePassword,
to update the respective states when the input value changes.
4. A function, onSubmit, which runs when the user click the submit button.
This function dispatches the setUser action type with the inputted
values as payload. This dispatch then updates the global state.
5. Two input fields, one for username and another for password.
6. A submit button to trigger the onSubmit function.*/

import { useContext, useState } from "react";

import { GlobalContext } from "../reducers/globalReducer";

export default function UserForm() {
  const { store, dispatch } = useContext(GlobalContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [decodedJWT, setDecodedJWT] = useState({});

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  /* Set header for basic authorization.
The btoa function encodes string into base64.
create a fetch request for the authentication route.
dispatch the setToken action type for updating the jwt
token in the global state.*/
  const onSubmit = async (e) => {
    e.preventDefault();

    let headers = new Headers();

    headers.set("Authorization", "Basic " + btoa(username + ":" + password));

    try {
      // Use backend directly to avoid CRA serving index.html at '/'
      const apiUrl = (
        process.env.REACT_APP_API_URL || "http://localhost:3001"
      ).replace(/\/$/, "");
      const resp = await fetch(`${apiUrl}/`, {
        headers: headers,
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();

      const token = data.freshJWT;

      dispatch({
        type: "setUser",
        data: {
          username: username,
          password: password,
        },
      });

      dispatch({
        type: "setToken",
        data: token,
      });
    } catch (err) {
      console.error("Authentication failed:", err);
      alert("Authentication failed. Is the backend running on port 3001?");
      dispatch({ type: "setToken", data: "" });
    }
  };

  /* extracted store from the global state along with dispatch because we will need the token from it.
a new state named decodedJWT to set when we get the decoded jwt from the protected route.
onAccessProtectedRoute function to hit the protected route from the backend, get the response
(decodedJWT) and then set the decodedJWT state's value.
a button to trigger the onAccessProtectedRoute function.
a div to display the username, password, iat and exp from the decoded jwt.
*/
  const onAccessProtectedRoute = async (e) => {
    e.preventDefault();

    let headers = new Headers();

    if (!store?.token) {
      alert("No token set. Authenticate first.");
      return;
    }

    headers.set("jwt", store.token);

    const apiUrl = (
      process.env.REACT_APP_API_URL || "http://localhost:3001"
    ).replace(/\/$/, "");
    try {
      const resp = await fetch(`${apiUrl}/someProtectedRoute`, {
        headers: headers,
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      setDecodedJWT(data.decodedJWT || {});
    } catch (err) {
      console.error("Protected route failed:", err);
      alert("Protected route failed. Is your token valid and backend running?");
      setDecodedJWT({});
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: 100,
      }}
    >
      <h1>UserForm</h1>
      <form>
        <div
          style={{
            marginBottom: 20,
          }}
        >
          <label>username: </label>
          <input onChange={onChangeUsername}></input>
        </div>
        <div
          style={{
            marginBottom: 20,
          }}
        >
          <label>password: </label>
          <input onChange={onChangePassword}></input>
        </div>
        <div>
          <button onClick={onSubmit}>Submit</button>
        </div>
        <div
          style={{
            marginTop: 20,
          }}
        >
          <button onClick={onAccessProtectedRoute}>
            Access Protected Route
          </button>
        </div>
        <div
          style={{
            marginTop: 20,
          }}
        >
          <div>
            {decodedJWT.username ?? ""}{" "} : {decodedJWT.password ?? ""} :
            {decodedJWT.iat ?? ""} : {decodedJWT.exp ?? ""}
          </div>
        </div>
      </form>
    </div>
  );
}

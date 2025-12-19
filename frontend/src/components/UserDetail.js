/* The UserDetail component displays the username and password from
the global state which was updated by the UserForm component.
So, this shows that our setup for global state is working fine.*/

import { useContext } from "react";

import { GlobalContext } from "../reducers/globalReducer";

export default function UserDetail() {
    // have made use of the global state, store, to display the username and password from that state.
    const { store } = useContext(GlobalContext);
    return (
        <div style={{ textAlign: "center", marginTop: 100 }}>
            <h1>UserDetail</h1>
            <div>
                {store.user?.username} : {store.user?.password}
            </div>
            {store.token && (
                <div style={{ marginTop: 10 }}>
                    Token: {store.token}
                </div>
            )}
        </div>
    );
}
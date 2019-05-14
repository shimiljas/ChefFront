/*
 * @file: configureStore.dev.js
 * @description: Configure/creating redux store with devToolsEnhancer,thunk,reducer etc
 * @date: 21.06.2017
 * @author: Manish Budhiraja
 * */

import { compose, applyMiddleware, createStore } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import { AsyncStorage, Platform } from "react-native";
import devToolsEnhancer from "remote-redux-devtools";
import thunk from "redux-thunk";
import reducer from "../redux";

/* *
 * @function: Configuring and creating redux store 
 * */
export default function configureStore() {

    /* *
     * @function: Creating redux store
     * */
    const store = createStore(
        reducer(),
        compose(
            autoRehydrate(),
            devToolsEnhancer({
                name: Platform.OS,
                hostname: "localhost",
                port: 5678
            })
        ),
        applyMiddleware(thunk)
    );

    /* *
     * @function: Persisting store for save all store's data except blacklisted reducers in device's memory
     * */
    persistStore(
        store, { blacklist: ["app", "nav", "toast", "location"], storage: AsyncStorage }
    );

    /* *
     * @return: returning store when it's successfully created 
     * */
    return store;
}
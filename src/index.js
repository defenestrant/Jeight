import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { createBrowserHistory } from "history"
import * as R from "ramda"

const history = createBrowserHistory()

window.jeighthistory = history


// const homepageRedirect = () => {
//     // if(localStorage.getItem("visited") == null)
//     // {
//     //     localStorage.setItem("visited", true)
//     //     history.replace("/conceptvideo")
//     //     return
//     // }
//     // history.replace("/home")
// }

// // value -> list -> bool
// const equalsAny = val => R.any(R.equals(val))

// if(!equalsAny(window.location.pathname)(["/prototype", "/settings"]))
// {
//     homepageRedirect()
// }


//const localStorageGetAndParse = R.pipe(localStorage.getItem, JSON.parse) // Doesn't work for some reason - TypeError: Illegal Invocation
const localStorageGetAndParse = key => JSON.parse(localStorage.getItem(key))
const savedSettings = localStorageGetAndParse("settings")
let savedAdditionsBaseDocmap = localStorageGetAndParse("additionsBaseDocmap")
savedAdditionsBaseDocmap = savedAdditionsBaseDocmap == null ? {} :  savedAdditionsBaseDocmap

console.log("SAVED SETTINGS", savedSettings)

ReactDOM.render(<App savedSettings={savedSettings} savedAdditionsBaseDocmap={savedAdditionsBaseDocmap} />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

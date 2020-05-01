import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.tsx";
import * as serviceWorker from "./serviceWorker";
import Theme from "./constants/Theme";
import { ThemeProvider } from "styled-components";

ReactDOM.render(
  <ThemeProvider theme={Theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

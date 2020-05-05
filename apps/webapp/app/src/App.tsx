import React from "react";
import "./App.css";
import MainPage from "./main_page/MainPage";
import Modal from "react-modal";

Modal.setAppElement("#root");

const App = () => {
  return (
    <div className="App">
      <MainPage />
    </div>
  );
};

export default App;

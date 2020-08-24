import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import { CookiesProvider } from "react-cookie";
import reducers from "./redux/reducers";
import App from "./components/App";

ReactDOM.render(
  <Provider
    store={createStore(reducers, applyMiddleware(reduxThunk))}
  >
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </Provider>,
  document.getElementById("root")
);

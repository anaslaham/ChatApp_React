import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { useCookies } from "react-cookie";
import socket from "../API/Socketio";
import Loginform from "./Form/form";
import chatAPI from "../API/ChatAPI";
import ChatList from "./Chatlist";
import Chat from "./chat";
import { Login, createMessage } from "../redux/actions";
import {
  ThemeProvider,
  darkTheme,
  elegantTheme,
  purpleTheme,
} from "@livechat/ui-kit";

const themes = {
  defaultTheme: {
    FixedWrapperMaximized: {
      css: {
        boxShadow: "0 0 1em rgba(0, 0, 0, 0.1)",
      },
    },
  },
  purpleTheme: {
    ...purpleTheme,
    TextComposer: {
      ...purpleTheme.TextComposer,
      css: {
        ...purpleTheme.TextComposer.css,
      },
    },
    OwnMessage: {
      ...purpleTheme.OwnMessage,
      secondaryTextColor: "#fff",
    },
  },
  elegantTheme: {
    ...elegantTheme,
    Message: {
      ...darkTheme.Message,
      secondaryTextColor: "#fff",
    },
    OwnMessage: {
      ...darkTheme.OwnMessage,
      secondaryTextColor: "#fff",
    },
  },
  darkTheme: {
    ...darkTheme,
    TextComposer: {
      css: {
        ...darkTheme.TextComposer.css,
        marginTop: "1em",
      },
    },
    Message: {
      ...darkTheme.Message,
      css: {
        ...darkTheme.Message.css,
        color: "#fff",
      },
    },
    OwnMessage: {
      ...darkTheme.OwnMessage,
      secondaryTextColor: "#fff",
    },
    TitleBar: {
      ...darkTheme.TitleBar,
      css: {
        ...darkTheme.TitleBar.css,
        padding: "1em",
      },
    },
  },
};
const App = (props) => {
  const [state, setState] = useState("purpleTheme");
  const [cookies, setCookie,removeCookie] = useCookies(["token", "username"]);
  const handleThemeChange = (name) => {
    setState(name + "Theme");
  };

  const handelSubmit = (name, pass, type, history) => {
    chatAPI
      .post(
        `/${type}`,
        {
          username: name,
          password: pass,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          const username = res.data.user.username;
          const token = res.data.token;
          const data = { username, token };
          props.addUserData(data);
          setCookie("token", token, { path: "/" });
          setCookie("username", username, { path: "/" });
          history.push("/");
        }
      });
  };
  const logOut =(history)=>{
    removeCookie("token", { path: "/" });
    removeCookie("username", { path: "/" });
    history.push("/login  ")
  }
  const onMessageSend = (text,chatId) => {
    socket.off("chat message")
    console.log("sent message");
    socket.on("chat message", ({ name, msg }) => {
      console.log(name + msg + "message receved from the server");
      props.createMessage(chatId,msg,name);
    });
    socket.emit("chat message", { msg: text, name: props.user.username });
  };
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => (
            <ThemeProvider theme={themes[state]}>
              <ChatList {...props} logOut={logOut}/>
            </ThemeProvider>
          )}
        ></Route>
        <Route
          path="/login"
          render={(props) => (
            <Loginform
              type="login"
              cookies={cookies}
              handelSubmit={handelSubmit}
              {...props}
            />
          )}
        />
        <Route
          path="/register"
          component={() => (
            <Loginform type="register" handelSubmit={handelSubmit} />
          )}
        />
        <Route
          path="/chat"
          render={(props) => {
            return (
              <ThemeProvider theme={themes[state]}>
                <Chat {...props} onMessageSend={onMessageSend} />
              </ThemeProvider>
            );
          }}
        />
      </Switch>
    </BrowserRouter>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.User,
  };
};
export default connect(mapStateToProps, { addUserData: Login, createMessage })(
  App
);

import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
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
class App extends React.Component {
  state = {
    theme: "purpleTheme",
  };

  handleThemeChange = (name) => {
    console.log("target.name", name);
    this.setState({
      theme: name + "Theme",
    });
  };

  handelSubmit = (name, pass, type, history) => {
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
          this.props.addUserData(data);
          history.history.push("/");
        }
      });
  };

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <ThemeProvider theme={themes[this.state.theme]}>
                <ChatList {...props} />
              </ThemeProvider>
            )}
          ></Route>
          <Route
            path="/login"
            component={(history) => (
              <Loginform
                type="login"
                handelSubmit={this.handelSubmit}
                history={history}
              />
            )}
          />
          <Route
            path="/register"
            component={() => (
              <Loginform type="register" handelSubmit={this.handelSubmit} />
            )}
          />
          <Route
            path="/chat"
            render={(props) => {
              return (
                <ThemeProvider theme={themes[this.state.theme]}>
                  <Chat {...props} />
                </ThemeProvider>
              );
            }}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user:state.User
  };
};
export default connect(mapStateToProps, { addUserData: Login, createMessage })(
  App
);

import React from "react";
import { connect } from "react-redux";
import { createMessage, addMessage } from "../redux/actions";
import { Link } from "react-router-dom";
import MessageInput from "../MessageInput/messageInput";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import MessageTest from "./Message/Message";

import { Row, Column } from "@livechat/ui-kit";
const parseNames = (user, chat) => {
  if (chat.user_1Name === user.username) {
    return {
      othername: chat.user_2Name,
    };
  } else {
    return {
      othername: chat.user_1Name,
    };
  }
};
class Maximized extends React.Component {
  getOrder = (index, length) => {
    if (index == 0) {
      return "first";
    } else if (index == length - 1) {
      return "last";
    }
    return "middle";
  };

  render() {
    if (this.props.user) {
      return (
        <div>
          <AppBar
            style={{ background: "linear-gradient(to right,#6D5BBA,#8D58BF)" }}
          >
            <Row flexFill>
              <Column>
                <Link to="/">
                  <IconButton color="primary" component="span">
                    <ArrowBackIcon color="disabled" fontSize="large" />
                    <Avatar
                      style={{
                        height: "2.5rem",
                        width: "2.5rem",
                        margin: ".2rem",
                      }}
                      src="https://stroseschool.stroselions.net/wp-content/uploads/2018/04/profile-blank-reva.png"
                    />
                  </IconButton>
                </Link>
              </Column>
              <Column flexFill>
                <h4 style={{ marginTop: ".5rem", marginLeft: ".1rem" }}>
                  {
                    parseNames(
                      this.props.user,
                      this.props.chat[this.props.selectedChat]
                    ).othername
                  }
                </h4>
              </Column>
            </Row>
          </AppBar>
          <div
            style={{
              paddingTop: ".2rem",
              marginTop: "4rem",
              overflowX: "scroll",
              overflowY: "none",
              background:
                "linear-gradient(to right, rgb(109, 91, 186), rgb(141, 88, 191))",
              paddingBottom: "4.5rem",
            }}
            className="list"
          >
            {this.props.chat[this.props.selectedChat].massages.map(
              (message, index, messagesArr) => (
                <MessageTest
                  order={this.getOrder(index, messagesArr.length)}
                  isOwn={!message.username === this.props.user.username}
                  text={message.content}
                  date={message.timeDate}
                />
              )
            )}
          </div>
          <MessageInput
            chatId={this.props.chat[this.props.selectedChat].id}
            onMessageSend={this.props.onMessageSend}
          />
        </div>
      );
    } else {
      this.props.history.push("/");
      return null;
    }
  }
}
const MapStateToProps = (RState) => {
  return {
    selectedChat: RState.selectedChat,
    chat: RState.Chats,
    user: RState.User,
  };
};
export default connect(MapStateToProps, { createMessage, addMessage })(
  Maximized
);

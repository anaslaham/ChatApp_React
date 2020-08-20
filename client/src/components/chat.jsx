import * as React from "react";
import { connect } from "react-redux";
import { createMessage, addMessage } from "../redux/actions";
import socket from "../API/Socketio";
import {
  Avatar,
  MessageList,
  Message,
  MessageText,
  AgentBar,
  Title,
  MessageGroup,
  TextComposer,
  Row,
  Fill,
  Fit,
  SendButton,
  Column,
  Bubble,
} from "@livechat/ui-kit";
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
  
  state = { messageText: "" };

  onMessageSend = (text, chatId) => {
    console.log(text);
    socket.emit("chat message", { msg: text, name: this.props.user.username });
    this.props.createMessage(chatId, text);
    socket.on("chat message", ({ name, msg }) => {
      console.log(name + msg + "called");
      this.props.addMessage(msg, name, this.props.chat.id);
    });
    this.setState({ messageText: "" });
  };

  componentWillUnmount() {
    socket.off("chat message");
  }
  
  render() {
    if (this.props.user) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 6rem)",
          }}
        >
          <AgentBar
            style={{
              height: "2rem",
              position: "fixed",
              top: "0",
              width: "100%",
            }}
          >
            <Row flexFill>
              <Column>
                <Avatar imgUrl="https://stroseschool.stroselions.net/wp-content/uploads/2018/04/profile-blank-reva.png" />
              </Column>
              <Column flexFill>
                <Title>
                  {parseNames(this.props.user, this.props.chat).othername}
                </Title>
              </Column>
            </Row>
          </AgentBar>
          <div
            style={{
              flexGrow: 1,
              minHeight: 0,
              height: "100%",
            }}
          >
            <MessageList
              active
              containScrollInSubtree
              style={{ paddingBottom: "4rem", marginTop: "3.5rem" }}
            >
              {this.props.chat.massages.map((message, index, messagesArr) => (
                <MessageGroup
                  onlyFirstWithMeta
                  isOwn={message.username === this.props.user.username}
                  style={{ marginBottom: "0rem" }}
                >
                  <Message
                    date={
                      index !== 0
                        ? messagesArr[index - 1].username !== message.username
                          ? message.timeDate
                          : null
                        : message.timeDate
                    }
                    isOwn={message.username === this.props.user.username}
                    key={index}
                    radiusType={"last"}
                    style={{ marginBottom: "0rem" }}
                  >
                    <Bubble
                      isOwn={message.username === this.props.user.username}
                      radiusType={"last"}
                    >
                      {message.content && (
                        <MessageText>{message.content}</MessageText>
                      )}
                    </Bubble>
                  </Message>
                </MessageGroup>
              ))}
            </MessageList>
          </div>
          <TextComposer
            style={{
              width: "100%",
              position: "fixed",
              bottom: 0,
              padding: "1rem",
            }}
          >
            <Row align="center">
              <Fill>
                <input
                  value={this.state.messageText}
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "1rem",
                    width: "100%",
                  }}
                  onChange={(e) => {
                    this.setState({ messageText: e.target.value });
                  }}
                />
              </Fill>
              <Fit>
                <SendButton
                  onClick={() => {
                    this.onMessageSend(
                      this.state.messageText,
                      this.props.chat.id
                    );
                  }}
                  style={{ marginRight: "1.5rem" }}
                />
              </Fit>
            </Row>
          </TextComposer>
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
    chat: RState.Chats[RState.selectedChat],
    user: RState.User,
  };
};
export default connect(MapStateToProps, { createMessage, addMessage })(
  Maximized
);

import React from "react";
import { connect } from "react-redux";
import { getChats, selectChat,createMessage } from "../redux/actions";
import socket from "../API/Socketio";
import {
  ChatList,
  ChatListItem,
  Avatar,
  Column,
  Row,
  Title,
  Subtitle,
} from "@livechat/ui-kit";

class chatList extends React.Component {
  componentDidMount() {
    this.props.getChats();
  }
  componentDidUpdate(){
    this.props.chats.forEach((chat) => {
      socket.emit("join", chat.id);
    });
    socket.on("join", (msgid) => {
      console.log(msgid);
    });
  }
  parseNames = (user, chat) => {
    if (chat.user_1Name === user.username) {
      return {
        username: chat.user_2Name,
      };
    } else {
      return {
        username: chat.user_1Name,
      };
    }
  };

  render() {
    if (this.props.user) {
      return (
        <div>
          <div
            style={{
              color: "#fff",
              padding: "1.5rem .2rem",
              width: "100vw",
              backgroundImage: "linear-gradient(to left, #21d4fd, #b721ff)",
            }}
          >
            <h2 style={{ marginLeft: ".5rem" }}>Messages</h2>
          </div>
          <ChatList style={{ maxWidth: "100%" }}>
            {this.props.chats
              ? this.props.chats.map((chat, index) => {
                  return (
                    <ChatListItem
                      key={index}
                      onClick={() => {
                        this.props.selectChat(index);
                        this.props.history.push("/chat");
                      }}
                      style={{
                        width: "98%",
                        fontSize: "1.05rem",
                        padding: "1rem 0",
                      }}
                    >
                      <Avatar
                        letter="K"
                        size="3rem"
                        style={{ marginLeft: ".5rem" }}
                      />
                      <Column fill>
                        <Row justify>
                          <Title ellipsis>
                            {this.parseNames(this.props.user, chat).username}
                          </Title>
                          <Subtitle
                            nowrap
                            style={{ position: "absolute", right: ".5rem" }}
                          >
                            {chat.massages &&
                              chat.massages[chat.massages.length - 1].timeDate}
                          </Subtitle>
                        </Row>
                        <Subtitle ellipsis>
                          {chat.massages &&
                            chat.massages[chat.massages.length - 1].content}
                        </Subtitle>
                      </Column>
                    </ChatListItem>
                  );
                })
              : null}
          </ChatList>
        </div>
      );
    } else {
      this.props.history.push("/login");
      return null;
    }
  }
}
const mapStateToProps = (state) => {
  return {
    chats: state.Chats,
    user: state.User,
  };
};
export default connect(mapStateToProps, { getChats, selectChat,createMessage })(chatList);

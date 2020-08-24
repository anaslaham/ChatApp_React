import "./MessageInput.css";
import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import { TextComposer, Row, Fill, Fit } from "@livechat/ui-kit";
import Picker from "emoji-picker-react";
class messageInput extends Component {
  state = { messageText: "", piker: false };
   onEmojiClick = (event, emojiObject) => {
    this.setState({messageText:this.state.messageText+emojiObject});
  };
  render() {
    return (
      <TextComposer
        style={{
          width: "95%",
          position: "fixed",
          bottom: 0,
          padding: ".5rem",
          boxSizing: "border-box",
          margin: ".5rem",
          borderRadius: "3rem",
          overFlow: "hidden",
          transition: "height .2s",
        }}
      >
        <Row align="center">
          <IconButton
            onClick={() => {
              this.setState({ piker: !this.state.piker });
            }}
          >
            <EmojiEmotionsIcon />
          </IconButton>
          <Fill>
            <input
              value={this.state.messageText}
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "1rem",
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                fontSize: "1.2rem",
              }}
              onChange={(e) => {
                this.setState({ messageText: e.target.value });
              }}
            />
          </Fill>
          <Fit>
            <IconButton
              onClick={() => {
                if (this.state.messageText !== "") {
                  this.props.onMessageSend(
                    this.state.messageText,
                    this.props.chatId
                  );
                }
                this.setState({ messageText: "" });
              }}
            >
              <SendIcon />
            </IconButton>
          </Fit>
        </Row>
        {this.state.piker && <Picker onEmojiClick={this.onEmojiClick} />}
      </TextComposer>
    );
  }
}

export default messageInput;

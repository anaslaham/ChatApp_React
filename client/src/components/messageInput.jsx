import React, { Component } from "react";
import { TextComposer, Row, Fill, Fit, SendButton } from "@livechat/ui-kit";
class messageInput extends Component {
  state = { messageText: "" };
  render() {
    return (
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
                this.props.onMessageSend(this.state.messageText,this.props.chatId);
                this.setState({ messageText: "" });
              }}
              style={{ marginRight: "1.5rem" }}
            />
          </Fit>
        </Row>
      </TextComposer>
    );
  }
}

export default messageInput;

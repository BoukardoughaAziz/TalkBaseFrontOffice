import React, { useEffect, memo, Fragment } from "react";
import { Row, Col, Dropdown, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import  "../../../node_modules/@chatscope/chat-ui-kit-styles/dist/default/styles.css";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react"; 
 
const ChatModule = memo((props) => {
   
  return (
    <div style={{ position: "center", height: "500px",width: "200px" }}>
    <MainContainer>
      <ChatContainer>
        <MessageList>
          <Message
            model={{
              message: "Hello my friend",
              sentTime: "just now",
              sender: "Joe",
            }}
          />
        </MessageList>
        <MessageInput placeholder="Type message here" />
      </ChatContainer>
    </MainContainer>
  </div>
  );
})

export default ChatModule 

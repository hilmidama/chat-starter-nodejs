import React, { useEffect, useContext, useCallback } from "react";
import axios from "axios"
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from ".";
import moment from "moment";
import { SocketContext } from "../../context/socket";


const Messages = (props) => {
  const { messages, otherUser, userId, conversationId} = props;
  const socket = useContext(SocketContext);

  useEffect(() => {
    var objDiv = document.getElementById("box");
    objDiv.scrollTop = objDiv.scrollHeight;
  })

  const body = {
    conversationId : conversationId
  }
  const readConversation = async () => {
    const { data } = await axios.put("/api/conversations", body);
    // send socket read
    socket.emit("read-message", {
      message: messages,
      sender: userId,
      conversationId: conversationId
    })

    socket.on("read-message", readMessage)
  }
  const readMessage = useCallback((data) => {
    console.log("from messages",data)
  })
  useEffect(() => {
    readConversation()
  }, [conversationId])

  return (
    <Box 
      id="box"
      sx={{
      mb: 2,
      display: "flex",
      flexDirection: "column",
      height: 480,
      overflow: "hidden",
      overflowY: "scroll",
    }}
    >
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} status={message.messageStatus} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;

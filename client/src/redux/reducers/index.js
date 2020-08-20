import { combineReducers } from "redux";
const selectedChat = (selectedChat = 0, action) => {
  if (action.type === "Chat-Selected") {
    return action.payload;
  }
  return selectedChat;
};
const ChatsReducer = (Chats = [], action) => {
  if (action.type === "chats") {
    return action.payload;
  } else if (action.type === "message" || action.type === "messageAdd") {
    let foundIndex;
    Chats.forEach((chat, index) => {
      if (chat.id === action.payload.id) {
        foundIndex = index;
      }
    });
    let newChats = Chats;
    newChats[foundIndex].massages.push(action.payload);
    console.log(newChats[foundIndex].massages);
    return newChats;
  }
  return Chats;
};
const handelUser = (User = null, action) => {
  if (action.type === "User") {
    return action.payload;
  }
  return User;
};
export default combineReducers({
  selectedChat,
  Chats: ChatsReducer,
  User: handelUser,
});

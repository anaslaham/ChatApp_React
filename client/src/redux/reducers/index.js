import { combineReducers } from "redux";
const selectedChat = (selectedChat = 0, action) => {
  if (action.type === "Chat-Selected") {
    return action.payload;
  }
  return selectedChat;
};
const ChatsReducer = (oldChats = [], action) => {
  if (action.type === "chats") {
    return action.payload;
  } else if (action.type === "message" || action.type === "messageAdd") {
    let foundIndex;
    oldChats.forEach((chat, index) => {
      if (chat.id === action.payload.id) {
        foundIndex = index;
      }
    });
    let newChats = [...oldChats];
    newChats[foundIndex].massages.push(action.payload);
    return newChats;
  }
  return oldChats;
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

import chatAPI from "../../API/ChatAPI";

export const selectChat = (chatIndex) => {
  return {
    type: "Chat-Selected",
    payload: chatIndex,
  };
};

export const getChats = () => async (dispatch, getstate) => {
  const res = await chatAPI.get("/chats", {
    headers: {
      "content-type": "application/json",
      Authorization: getstate().User ? getstate().User.token : "",
    },
  });
  dispatch({ type: "chats", payload: res.data });
};

export const Login = (user) => {
  return {
    type: "User",
    payload: user,
  };
};

export const createMessage = (chatId, content,username) => async (
  dispatch,
  getstate
) => {
  const res = await chatAPI.post(
    "/message",
    {
      username,
      chatId,
      content,
    },
    {
      headers: {
        "content-type": "application/json",
        Authorization: getstate().User ? getstate().User.token : "",
      },
    }
  );

  dispatch({
    type: "message",
    payload: { content, id: res.data.id, username },
  });
};

export const addMessage = (content, username, chatId) => {
  return {
    type: "messageAdd",
    payload: { content, username, id: chatId },
  };
};

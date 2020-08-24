import "./Message.css";
import React from "react";
import moment from "moment";
const flipCorners = (isOwn, oldStyle) => {
  if (isOwn) {
    oldStyle += "owner";
    return oldStyle;
  } else {
    return oldStyle;
  }
};
const getMessageStyle = (order, isOwn) => {
  if (order) {
    return flipCorners(isOwn, ("Message__container Message__container" + order));
  }
  return flipCorners(isOwn, ("Message__container Message__container" + "middle"));
};

const Message = ({ text, date, isOwn, order }) => {
  return (
    <div style={{ textAlign: isOwn ? "right" : null,margin: ".5rem 0" }}>
      <div className={getMessageStyle(order, isOwn)}>
        <div className="Message__text">{text}</div>
        <div className="Message__date">{moment(date).format("LT")}</div>
      </div>
    </div>
  );
};

export default Message;

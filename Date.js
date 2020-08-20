const getCurrdate = (Date) => {
  return (
    Date.getFullYear() + "-" + (Date.getMonth() + 1) + "-" + Date.getDate()
  );
};
const getCurrTime = (Date) => {
  return Date.getHours() + ":" + Date.getMinutes() + ":" + Date.getSeconds();
};
const getDateTime = (Date) => {
  return `${getCurrdate(Date)} ${getCurrTime(Date)}`;
};
module.exports.getCurrdate = getCurrdate;
module.exports.getCurrTime = getCurrTime;
module.exports.getDateTime = getDateTime;

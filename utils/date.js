var exports = module.exports = {};

exports.getTodayDate = () => {
  const dateObject = new Date();
  const y = dateObject.getFullYear();
  const m = dateObject.getMonth();
  const d = dateObject.getDate()

  const today = new Date(y, m, d);
  return today;
}

exports.getDateString = (date) => {
  const dateObject = new Date(date);
  const y = dateObject.getFullYear();
  const m = (dateObject.getMonth() + 1).toLocaleString(undefined, {minimumIntegerDigits: 2});
  const d = dateObject.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2});
  
  return `${y}.${m}.${d}`
};

exports.getDday = (due) => {
  const today = new Date();
  const dueDate = new Date(due);

  if (exports.getDateString(today) === exports.getDateString(dueDate)) {
    return '-day'
  }

  const diff = dueDate - today;
  const dday = Math.floor(diff / (1000*60*60*24))

  return (diff < 0) ? `+${-dday}` : `-${dday}`;
}
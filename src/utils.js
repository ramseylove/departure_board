export function formatTwelveHour(date) {
  //convert string to date
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // '0' = '12' noon or midnight
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
}

export function formatTwentyFourHour(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const dateTZ = new Date(
    date.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  console.log(dateTZ);
  const hour = padZero(dateTZ.getHours());
  const min = padZero(dateTZ.getMinutes());

  return `${hour}:${min}`;
}

export function formatDate(date) {
  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

function padZero(num) {
  let s_num = num.toString();
  if (s_num.length === 1) s_num = s_num.padStart(2, "0");
  return s_num;
}

export function formatRange(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const timeSpan = 60 * 60 * 1000 * 2; // (60 * 60 * 1000) === 1 hour
  const strDate = formatDate(date);
  const currentTime = date.getTime();
  const endTime = formatTwentyFourHour(new Date(currentTime + timeSpan));
  const startTime = formatTwentyFourHour(date);

  return [strDate, startTime, endTime];
}

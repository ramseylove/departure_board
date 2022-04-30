const baseUrl = "https://api-v3.mbta.com/";

export const getSchedules = async function (date, startTime, endTime) {
  const filters = {
    directionTypeStop:
      "filter%5Bdirection_id%5D=0&filter%5Broute_type%5D=2&filter%5Bstop%5D=place-north",
    date: `filter%5Bdate%5D=${date}`,
    startTime: `filter%5Bmin_time%5D=${startTime}`,
    endTime: `filter%5Bmax_time%5D=${endTime}`,
  };

  const filterConstruct = Object.values(filters).join("&");

  const include = "include=stop,route";
  const sort = "sort=departure_time";
  const stops = "filter%5Bstop_sequence%5D=first%2C%20last";

  const builtUrl = `${baseUrl}schedules?${sort}&${include}&${filterConstruct}&${stops}`;

  const response = await fetch(builtUrl);

  const data = await response.json();
  //   console.log("schedules: ", data);
  return data;
};

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

  return data;
};

export const getSchedule = async function (tripIdArray) {
  const today = formatDate(new Date());
  const sort = "sort=departure_time";
  const lastStop = "filter%5Bstop_sequence%5D=last&filter%5Broute_type%5D=2";
  const date = `filter%5Bdate%5D=${today}`;
  const trips = `filter%5Btrip%5D=${tripIdArray.join(",")}`;

  let trip = [];
  try {
    const response = await fetch(
      `${baseUrl}schedules?${sort}&${date}&${trips}&${lastStop}`
    );
    trip = await response.json();
  } catch (error) {
    console.error(error);
  }

  return trip.data;
};

function formatDate(date) {
  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1);
  const year = date.getFullYear();

  function padZero(num) {
    let s_num = num.toString();
    if (s_num.length === 1) s_num = s_num.padStart(2, "0");
    return s_num;
  }

  return `${year}-${month}-${day}`;
}

export const getStatus = async function (tripId) {
  const stop = "filter%5Bstop%5D=place-north";
  const fields = "fields%5Bprediction%5D=status";
  const trip = `filter%5Btrip%5D=${tripId}`;
  let statusResponse = [];
  try {
    const response = await fetch(
      `${baseUrl}predictions?${fields}&${trip}&${stop}`
    );

    statusResponse = await response.json();
  } catch (error) {
    console.log(error);
  }
  console.log(statusResponse);
  return statusResponse;
};

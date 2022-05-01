const baseUrl = "https://api-v3.mbta.com/";

export const getSchedules = async function (date, startTime, endTime) {
  const filters = {
    directionTypeStop:
      "filter%5Bdirection_id%5D=0&filter%5Broute_type%5D=2&filter%5Bstop%5D=place-north",
    date: `filter%5Bdate%5D=${date}`,
    startTime: `filter%5Bmin_time%5D=${startTime}`,
    endTime: `filter%5Bmax_time%5D=${endTime}`,
    stops: "filter%5Bstop_sequence%5D=first%2C%20last",
  };

  const filterConstruct = Object.values(filters).join("&");
  const sort = "sort=departure_time";

  const firstUrl = `${baseUrl}schedules?${sort}&${filterConstruct}`;

  let tripIds = [];
  let schedules = [];
  try {
    const response = await fetch(firstUrl);
    let data = await response.json();
    // build array for schedule requests
    data.data.forEach((ele) => tripIds.push(ele.relationships.trip.data.id));

    for (const schedule of data.data) {
      //format time to HH:MM
      const departureTime = formatTime(schedule.attributes.departure_time);

      schedules.push({
        id: schedule.id,
        departureTime: departureTime,
        tripId: schedule.relationships.trip.data.id,
      });
    }

    const scheduleData = await getSchedule(tripIds);
    schedules.forEach((ele, idx) => {
      const foundEle = scheduleData.find(
        (element) => element.tripId === ele.tripId
      );
      schedules[idx] = { ...ele, ...foundEle };
    });
    console.log(schedules);
    return schedules;
  } catch (error) {
    console.log(error);
  }
};

export async function getSchedule(tripIdArray) {
  const today = formatDate(new Date());

  const sort = "sort=departure_time";
  const routeType = "filter%5Broute_type%5D=2";
  const lastStop = "filter%5Bstop_sequence%5D=last";
  const date = `filter%5Bdate%5D=${today}`;
  const trips = `filter%5Btrip%5D=${tripIdArray.join(",")}`;
  const include = "include=stop.attributes.name";

  let scheduleData = [];
  let includedData = [];
  let formattedData = [];
  try {
    const response = await fetch(
      `${baseUrl}schedules?${sort}&${include}&${date}&${routeType}&${trips}&${lastStop}`
    );
    let data = await response.json();
    scheduleData = [...data.data];
    includedData = [...data.included];

    for (const schedule of scheduleData) {
      const includes = includedData.find(
        (ele) => ele.id === schedule.relationships.stop.data.id
      );
      const arrivalTime = formatTime(schedule.attributes.arrival_time);

      formattedData.push({
        tripId: schedule.relationships.trip.data.id,
        scheduleId: schedule.id,
        stopId: includes.id,
        name: includes.attributes.name,
        arrivalTime: arrivalTime,
      });
    }
    console.log("SD: ", scheduleData);
    console.log("ID: ", includedData);
    return formattedData;
  } catch (error) {
    console.error(error);
  }
}

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

function formatTime(dateString) {
  const date = new Date(dateString);
  const hour = date.getUTCHours();
  const min = date.getUTCMinutes();

  return `${hour}:${min}`;
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

  return statusResponse;
};

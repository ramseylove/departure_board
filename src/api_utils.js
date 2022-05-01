import { formatTwelveHour } from "./utils";
const baseUrl = "https://api-v3.mbta.com/";

export async function getSchedules(date, startTime, endTime) {
  console.log(startTime, endTime);
  const filters = {
    directionTypeStop:
      "filter%5Bdirection_id%5D=0&filter%5Broute_type%5D=2&filter%5Bstop%5D=place-north",
    date: `filter%5Bdate%5D=${date}`,
    startTime: `filter%5Bmin_time%5D=${startTime}`,
    endTime: `filter%5Bmax_time%5D=${endTime}`,
    // stops: "filter%5Bstop_sequence%5D=last",
  };

  const filterConstruct = Object.values(filters).join("&");
  const sort = "sort=departure_time";

  const firstUrl = `${baseUrl}schedules?${sort}&${filterConstruct}`;

  let tripIds = [];
  let schedules = [];
  try {
    const response = await fetch(firstUrl);
    let data = await response.json();
    if (data) {
      // build array for schedule requests
      tripIds = data.data.map((ele) => ele.relationships.trip.data.id);
      // get each schedule and status
      const scheduleData = await getSchedule(date, tripIds);
      const statusData = await getAllStatus(tripIds);

      if (scheduleData && statusData) {
        schedules = data.data.map((schedule) => {
          const scheduleEle = scheduleData.find(
            (ele) => ele.tripId === schedule.relationships.trip.data.id
          );
          const status = statusData.data.find(
            (ele) =>
              ele.relationships.trip.data.id ===
              schedule.relationships.trip.data.id
          );
          //format time to 12:00
          const departureTime = formatTwelveHour(
            schedule.attributes.departure_time
          );
          return {
            id: schedule.id,
            departureTime: departureTime,
            tripId: schedule.relationships.trip.data.id,
            status: status.attributes.status,
            ...scheduleEle,
          };
        });
      }

      console.log(schedules);
      return schedules;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getSchedule(inputDate, tripIdArray) {
  // const today = formatDate(new Date());

  const sort = "sort=departure_time";
  const routeType = "filter%5Broute_type%5D=2";
  const lastStop = "filter%5Bstop_sequence%5D=last";
  const date = `filter%5Bdate%5D=${inputDate}`;
  const trips = `filter%5Btrip%5D=${tripIdArray.join(",")}`;
  const include = "include=stop.attributes.name";

  try {
    const response = await fetch(
      `${baseUrl}schedules?${sort}&${include}&${date}&${routeType}&${trips}&${lastStop}`
    );
    let data = await response.json();
    if (data.data && data.included) {
      const formattedData = data.data.map((schedule) => {
        // match data in included array with main data
        const includes = data.included.find(
          (ele) => ele.id === schedule.relationships.stop.data.id
        );
        const arrivalTime = formatTwelveHour(schedule.attributes.arrival_time);
        return {
          tripId: schedule.relationships.trip.data.id,
          scheduleId: schedule.id,
          stopId: includes.id,
          name: includes.attributes.name,
          arrivalTime: arrivalTime,
        };
      });
      console.log("formattedData: ", formattedData);
      return formattedData;
    }
  } catch (error) {
    console.error(error);
  }
}

export const getStatus = async function (tripId) {
  const stop = "filter%5Bstop%5D=place-north";
  const fields = "fields%5Bprediction%5D=status";
  const trip = `filter%5Btrip%5D=${tripId}`;

  try {
    const response = await fetch(
      `${baseUrl}predictions?${fields}&${trip}&${stop}`
    );

    let statusResponse = await response.json();
    if (statusResponse.data[0]) {
      return statusResponse?.data[0].attributes.status;
    }
  } catch (error) {
    console.log(error);
  }
  return "Unknown";
};

export const getAllStatus = async function (tripIdArray) {
  const stop = "filter%5Bstop%5D=place-north";
  const fields = "fields%5Bprediction%5D=status";
  const trip = `filter%5Btrip%5D=${tripIdArray.join(",")}`;

  try {
    const response = await fetch(
      `${baseUrl}predictions?${fields}&${trip}&${stop}`
    );

    let statusResponse = await response.json();
    // if (statusResponse.data[0]) {
    //   return statusResponse?.data[0].attributes.status;
    // }
    console.log(statusResponse);
    return statusResponse;
  } catch (error) {
    console.log(error);
  }
};

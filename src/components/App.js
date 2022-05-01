import { useEffect, useState } from "react";
import { getSchedules, getStatus } from "../api_utils";
import { formatRange } from "../utils";

import Destination from "./Destination";

import "./App.css";

function App() {
  const [schedules, setSchedules] = useState();

  useEffect(() => {
    const [date, startTime, endTime] = formatRange(new Date());

    getSchedules(date, startTime, endTime).then((data) => setSchedules(data));
  }, []);

  if (!schedules) {
    return <p>No Schedules</p>;
  }

  return (
    <div className="App">
      <h1>North Station</h1>
      <div className="board">
        {schedules && (
          <table>
            <caption>Departure times for North Station</caption>
            <thead>
              <tr>
                <th>Time</th>
                <th>Destination</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((destination) => (
                <Destination
                  key={destination.tripId}
                  tripId={destination.tripId}
                  name={destination.name}
                  departureTime={destination.departureTime}
                  status={destination.status}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import { getSchedules } from "../api_utils";
import { formatRange } from "../utils";

import Destination from "./Destination";

import "./App.css";
import Header from "./Header";

function App() {
  const [schedules, setSchedules] = useState();

  useEffect(() => {
    const [date, startTime, endTime] = formatRange(new Date());

    getSchedules(date, startTime, endTime).then((data) => setSchedules(data));
  }, []);

  return (
    <div className="App">
      <Header />
      <div className="board">
        <table>
          <caption>Departure times for North Station</caption>
          <thead>
            <tr>
              <th>Time</th>
              <th align="left">Destination</th>
              <th>Status</th>
            </tr>
          </thead>
          {schedules ? (
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
          ) : (
            <tbody>
              <tr>
                <td></td>
                <td>Loading Routes</td>
                <td></td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}

export default App;

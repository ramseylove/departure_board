import { useEffect, useState } from "react";
import { getSchedules } from "../api_utils";

import Destination from "./Destination";

import "./App.css";

function App() {
  const [schedules, setSchedules] = useState();

  useEffect(() => {
    getSchedules("2022-04-30", "18%3A00", "18%3A59").then((data) =>
      setSchedules(data)
    );
  }, []);

  if (!schedules) {
    return <p>No Schedules</p>;
  }

  return (
    <div className="App">
      <h1>North Station Departures</h1>
      <div class="board">
        <table>
          <caption>Departure times from North Station</caption>
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
                id={destination.stopId}
                name={destination.name}
                departureTime={destination.departureTime}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

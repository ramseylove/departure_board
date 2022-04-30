import { useEffect, useState } from "react";
import { getSchedules, getSchedule } from "../api_utils";

import "./App.css";

function App() {
  const [schedules, setSchedules] = useState();

  useEffect(() => {
    getSchedules("2022-04-29", "18%3A00", "18%3A59").then((data) =>
      setSchedules(data)
    );
    getSchedule(["CR-A522039-1113-MRNewbptSlmRockport"]);
  }, []);

  if (!schedules) {
    return <p>No Schedules</p>;
  }

  return (
    <div className="App">
      <h1>Departure Board</h1>
      <ul>
        {schedules.data.map((route) => (
          <li key={route.id}>{route.id}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

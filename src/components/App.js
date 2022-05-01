import { useEffect, useState } from "react";
import { getSchedules, getSchedule, getStatus } from "../api_utils";

import "./App.css";

function App() {
  const [schedules, setSchedules] = useState();

  useEffect(() => {
    getSchedules("2022-04-30", "18%3A00", "18%3A59").then((data) =>
      setSchedules(data)
    );
    getSchedule(["CR-A522039-1113-MRNewbptSlmRockport", "CR-503093-1313"]);
    // getStatus("CR-503115-1207");
  }, []);

  if (!schedules) {
    return <p>No Schedules</p>;
  }

  return (
    <div className="App">
      <h1>Departure Board</h1>
      <ul>
        {schedules.map((route) => (
          <li key={route.id}>{route.id}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

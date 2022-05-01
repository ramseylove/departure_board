import React, { useEffect, useState } from "react";

function Header() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const clock = setInterval(() => {
      setDateTime(new Date());
    }, 1 * 1000);

    return () => {
      clearInterval(clock);
    };
  }, []);

  const timeOptions = { hour12: true, timeStyle: "short" };

  return (
    <div className="header">
      <div className="date">{dateTime.toDateString()}</div>
      <div className="time">
        {dateTime.toLocaleTimeString("en-US", timeOptions)}
      </div>
    </div>
  );
}

export default Header;

import React from "react";

function Destination({ tripId, name, departureTime, status }) {
  return (
    <tr>
      <td>{departureTime}</td>
      <td>{name}</td>
      <td>{status ? status : "Unknown"}</td>
    </tr>
  );
}

export default Destination;

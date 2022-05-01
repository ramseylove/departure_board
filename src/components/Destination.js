import React from "react";

function Destination({ name, departureTime, status }) {
  return (
    <tr>
      <td>{departureTime}</td>
      <td align="left">{name}</td>
      <td>{status ? status : "Unknown"}</td>
    </tr>
  );
}

export default Destination;

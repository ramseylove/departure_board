import React from "react";

function Destination({ stopId, name, departureTime }) {
  return (
    <tr key={stopId}>
      <td>{name}</td>
      <td>{departureTime}</td>
      <td>On Time</td>
    </tr>
  );
}

export default Destination;

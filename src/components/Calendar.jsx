import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);

export function CalendarComponent() {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => fetchData(), []);

  const fetchData = () => {
    fetch("http://traineeapp.azurewebsites.net/api/trainings")
      .then((res) => res.json())
      .then((data) => {
        Promise.all(
          data.content.map((training) =>
            fetch(training.links.find((link) => link.rel === "customer").href)
              .then((res) => res.json())
              .then((customerData) => ({
                title: `${training.activity} / ${customerData.firstname} ${customerData.lastname}`,
                start: moment(training.date).toDate(),
                end: moment(training.date).add(training.duration, "m").toDate(),
                customerName: `${customerData.firstname} ${customerData.lastname}`,
              }))
          )
        )
          .then((formattedTrainings) => setTrainings(formattedTrainings))
          .catch((error) => console.error(error));
      });
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={trainings}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        tooltipAccessor="customerName"
        style={{ color: "black", backgroundColor: "#f2f2f2" }}
        views={["week", "day"]}
        defaultView="week"
      />
    </div>
  );
}

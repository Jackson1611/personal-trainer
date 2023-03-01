import React, { useState, useEffect } from "react";
import _ from "lodash";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export function TrainingChart() {
  const [trainings, setTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setIsLoading(true);
    setError(null);
    fetch("http://traineeapp.azurewebsites.net/api/trainings")
      .then((res) => res.json())
      .then((data) => {
        Promise.all(
          data.content.map((training) =>
            fetch(training.links.find((link) => link.rel === "customer").href)
              .then((res) => res.json())
              .then((customerData) => ({
                activity: training.activity,
                duration: training.duration,
                date: dayjs(training.date).format("DD-MM-YYYY HH.mm a"),
                time: dayjs(training.date).format("HH.mm"),
                customerName: `${customerData.firstname} ${customerData.lastname}`,
                link: training.links[0].href,
              }))
          )
        )
          .then((formattedTrainings) => {
            setTrainings(formattedTrainings);
            setIsLoading(false);
          })
          .catch((error) => {
            setError(error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const groupTrainingsByActivity = () => {
    const groupedTrainings = _.groupBy(trainings, "activity");
    const summedDurations = _.mapValues(groupedTrainings, (group) =>
      _.sumBy(group, "duration")
    );
    return summedDurations;
  };

  if (isLoading) {
    return <div style={{ color: "black" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "black" }}>Error: {error.message}</div>;
  }

  const chartData = Object.entries(groupTrainingsByActivity()).map(
    ([activity, duration]) => ({ activity, duration })
  );

  return (
    <div style={{ color: "black" }}>
      <h1>Training activity status </h1>
      <div
        style={{
          marginTop: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BarChart
          width={1500}
          height={800}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="activity" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="duration"
            fill="rgb(51, 102, 204)"
            stroke="rgb(0, 0, 0)"
          />
        </BarChart>
      </div>
    </div>
  );
}

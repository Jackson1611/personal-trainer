import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from "@mui/material/Button";
import dayjs from "dayjs";

export function Traininglist() {
  const [trainings, setTrainings] = useState([]);
  const [gridApi, setGridApi] = useState(null);

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
                activity: training.activity,
                duration: training.duration,
                date: dayjs(training.date).format("DD-MM-YYYY HH.mm a"),
                time: dayjs(training.date).format("HH.mm"),
                customerName: `${customerData.firstname} ${customerData.lastname}`,
                link: training.links[0].href,
              }))
          )
        )
          .then((formattedTrainings) => setTrainings(formattedTrainings))
          .catch((error) => console.error(error));
      });
  };

  const deleteTraining = (link) => {
    if (window.confirm("Are you sure?")) {
      fetch(link, { method: "DELETE" })
        .then((response) => fetchData())
        .catch((err) => console.error(err));
      alert("Training is deleted!");
    } else {
      alert("Nothing deleted.");
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onBtExport = () => {
    gridApi.exportDataAsCsv();
  };

  const columns = [
    {
      headerName: "Activity",
      field: "activity",
      sortable: true,
      filter: true,
      cellStyle: { fontSize: "17px" },
    },
    {
      headerName: "Date",
      field: "date",
      sortable: true,
      filter: true,
      cellStyle: { fontSize: "16px" },
    },
    {
      headerName: "Duration (minutes)",
      field: "duration",
      sortable: true,
      filter: true,
      cellStyle: { fontSize: "17px" },
    },
    {
      headerName: "Customer Name",
      field: "customerName",
      sortable: true,
      filter: true,
      cellStyle: { fontSize: "17px" },
    },
    {
      headerName: "action",
      field: "link",
      cellRenderer: ({ value }) => (
        <Button size="large" onClick={() => deleteTraining(value)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div
      className="container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        className="ag-theme-material"
        style={{ height: "900px", width: "1000px", margin: "" }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={trainings}
          enableSorting={true}
          enableFilter={true}
          onGridReady={onGridReady}
        />

        <div style={{ margin: "10px", display: "inline-flex" }}>
          <Button
            onClick={onBtExport}
            style={{ margin: 10, fontSize: "20px" }}
            variant="outlined"
            size="large"
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}

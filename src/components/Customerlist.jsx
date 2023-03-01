import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from "@mui/material/Button";
import Addcustomer from "./Addcustomer";
import Addtraining from "./AddTraining";

export function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  /* fetch function */
  useEffect(() => fetchData(), []);

  const fetchData = () => {
    fetch("http://traineeapp.azurewebsites.net/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.content);
      })
      .catch((error) => console.error(error));
  };

  /* in line edit */
  function handleCellValueChanged(params) {
    const data = { ...params.data };
    const updatedData = { ...data, [params.colDef.field]: params.newValue };
    updateCustomer(updatedData);
  }

  async function updateCustomer(customerData) {
    const response = await fetch(`${customerData.links[0].href}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update customer data: ${response.statusText}`);
    }
  }

  /* delete function */
  const deleteCustomer = (link) => {
    if (window.confirm("Are you sure?")) {
      fetch(link, { method: "DELETE" })
        .then((response) => fetchData())
        .catch((err) => console.error(err));
      alert("Customer is deleted!");
    } else {
      alert("Nothing deleted.");
    }
  };

  /* save function */
  const saveCustomer = (customer) => {
    fetch("http://traineeapp.azurewebsites.net/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    })
      .then((response) => fetchData())
      .catch((err) => console.error(err));
  };

  const saveTraining = (training) => {
    fetch("http://traineeapp.azurewebsites.net/api/trainings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(training),
    })
      .then((response) => fetchData())
      .catch((err) => console.error(err));
  };

  /* export CSV function */
  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onBtExport = () => {
    gridApi.exportDataAsCsv();
  };

  const columns = [
    {
      headerName: "Last Name",
      field: "lastname",
      sortable: true,
      filter: true,
      editable: true,
      floatingFilter: true,
      onCellValueChanged: handleCellValueChanged,
      cellStyle: { fontSize: "17px" },
    },
    {
      headerName: "First Name",
      field: "firstname",
      sortable: true,
      filter: true,
      editable: true,
      floatingFilter: true,
      onCellValueChanged: handleCellValueChanged,
      cellStyle: { fontSize: "17px" },
    },
    {
      headerName: "Email",
      field: "email",
      sortable: true,
      filter: true,
      editable: true,
      floatingFilter: true,
      onCellValueChanged: handleCellValueChanged,
      cellStyle: { fontSize: "17px" },
    },
    {
      headerName: "Phone",
      field: "phone",
      sortable: true,
      filter: true,
      editable: true,
      floatingFilter: true,
      onCellValueChanged: handleCellValueChanged,
      cellStyle: { fontSize: "17px" },
    },
    {
      headerName: "Address",
      field: "streetaddress",
      sortable: true,
      filter: true,
      editable: true,
      floatingFilter: true,
      onCellValueChanged: handleCellValueChanged,
      cellStyle: { fontSize: "17px" },
    },
    {
      headerName: "Postcode",
      field: "postcode",
      sortable: true,
      filter: true,
      editable: true,
      floatingFilter: true,
      onCellValueChanged: handleCellValueChanged,
      cellStyle: { fontSize: "17px" },
    },
    {
      headerName: "City",
      field: "city",
      sortable: true,
      filter: true,
      editable: true,
      floatingFilter: true,
      onCellValueChanged: handleCellValueChanged,
      cellStyle: { fontSize: "17px" },
    },
    {
      headerName: "Action",
      width: 120,
      cellRendererFramework: (props) => (
        <Button onClick={() => deleteCustomer(props.data.links[0].href)}>
          Delete
        </Button>
      ),
    },
    /*{
      headerName: "Add",
      cellRendererFramework: (props) => (
        <Addtraining saveTraining={saveTraining} customerId={props.data.id} />
      ),
    },
    */
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
        style={{
          height: "900px",
          width: "1550px",
          margin: "",
          justifyContent: "center",
        }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={customers}
          enableSorting={true}
          enableFilter={true}
          onGridReady={onGridReady}
        />
        <div style={{ margin: "10px", display: "inline-flex" }}>
          <Addcustomer saveCustomer={saveCustomer} />
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

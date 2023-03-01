import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function Addtraining(props) {
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    date: dayjs().toISOString(),
    activity: "",
    duration: "",
    customer: "",
  });

  const handleClickOpen = () => {
    setTraining({
      date: props.date,
      activity: props.activity,
      duration: props.duration,
      customer: props.customer,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setTraining({ ...training, [e.target.name]: e.target.value });
  };

  const updateTraining = () => {
    const date = dayjs(training.date, "DD.MM.YY HH:mm").toDate();
    const isoDate = date.toISOString();
    const updatedTraining = { ...training, date: isoDate };
    props.saveTraining(updatedTraining);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>Add training</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add training</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={training.date}
              onChange={(event) => handleInputChange(event)}
              renderInput={(params) => <TextField {...params} />}
              format="DD.MM.YY HH:mm"
            />
          </LocalizationProvider>
          <TextField
            margin="dense"
            name="activity"
            value={training.activity}
            onChange={(event) => handleInputChange(event)}
            label="activity"
            fullWidth
          />
          <TextField
            margin="dense"
            name="duration"
            value={training.duration}
            onChange={(event) => handleInputChange(event)}
            label="duration"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={updateTraining}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

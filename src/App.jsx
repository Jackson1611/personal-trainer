import "./App.css";
import { CustomerList } from "./components/Customerlist";
import { Traininglist } from "./components/Training";
import { CalendarComponent } from "./components/Calendar";
import { TrainingChart } from "./components/TrainingChart";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Container } from "@material-ui/core";
function App() {
  return (
    <div className="App" style={{ width: "1400px" }}>
      <BrowserRouter>
        <AppBar>
          <Toolbar>
            <Typography variant="h3" style={{ marginLeft: "1rem" }}>
              <Link
                to="/customer"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Customer
              </Link>
            </Typography>
            <Typography variant="h3" style={{ marginLeft: "3rem" }}>
              <Link
                to="/training"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Training
              </Link>
            </Typography>
            <Typography variant="h3" style={{ marginLeft: "3rem" }}>
              <Link
                to="/calender"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Calendar
              </Link>
            </Typography>
            <Typography variant="h3" style={{ marginLeft: "3rem" }}>
              <Link
                to="/chart"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Chart
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>

        <Container>
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/customer" element={<CustomerList />} />
            <Route path="/training" element={<Traininglist />} />
            <Route path="/calender" element={<CalendarComponent />} />
            <Route path="/chart" element={<TrainingChart />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;

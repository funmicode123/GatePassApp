import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/login/Login";
import Signup from "./auth/signup/Signup";
import Home from "./pages/Home";
import GenerateOtp from "./pages/GenerateOtp";
import VerifyOtp from "./pages/Otp";
import ExitPass from "./pages/ExitPass"
import VisitingLog from "./pages/VisitingLog";
import AddApartment from "./pages/AddApartment";
import ApproveResident from "./pages/ApproveResident";
import CreateSecurity from "./pages/CreateSecurity";
import Profile from "./pages/Profile";
import BlacklistManager from "./pages/BlacklistManager";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/generate-otp" element={<GenerateOtp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/exit" element={<ExitPass />} />
        <Route path="/view" element={<VisitingLog />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/addApartment" element={<AddApartment />} />
        <Route path="/approveResident" element={<ApproveResident />} />
        <Route path="/createSecurity" element={<CreateSecurity />} />
        <Route path="/blacklist" element={<BlacklistManager />} />
      </Routes>
    </Router>
  );
}

export default App;

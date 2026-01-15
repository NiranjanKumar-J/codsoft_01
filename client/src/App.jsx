import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Global Navbar

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob';
import CandidateDashboard from './pages/CandidateDashboard';
import AppliedJobs from './pages/AppliedJobs';
import Jobs from './pages/Jobs'; // 🔥 Import the new "Available Jobs" page

function App() {
  return (
    <BrowserRouter>
      {/* Navbar stays on top of all pages */}
      <Navbar />
      
      <div style={{ marginTop: '0px' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Employer Routes */}
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          
          {/* Candidate Routes */}
          <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          
          {/* 🔥 NEW ROUTE: Available Jobs (Where candidates apply) */}
          <Route path="/jobs" element={<Jobs />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
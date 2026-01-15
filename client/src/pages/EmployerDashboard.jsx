import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmployerDashboard() {
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJobApps, setSelectedJobApps] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/jobs/myjobs', {
        headers: { 'x-auth-token': token }
      });
      setMyJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/jobs/${jobId}`, {
        headers: { 'x-auth-token': token }
      });
      alert('Job Deleted Successfully');
      setMyJobs(myJobs.filter(job => job._id !== jobId));
      setSelectedJobApps(null);
    } catch (err) {
      alert('Error deleting job');
    }
  };

  const viewApplications = async (jobId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`/api/applications/${jobId}`, {
        headers: { 'x-auth-token': token }
      });
      setSelectedJobApps(res.data);
      // Scroll to applications
      setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
    } catch (err) {
      alert('Error fetching applications');
    }
  };

  const updateStatus = async (appId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
        await axios.put(`/api/applications/status/${appId}`, 
            { status: newStatus },
            { headers: { 'x-auth-token': token } }
        );
        alert(`Candidate ${newStatus} successfully!`);
        setSelectedJobApps(prev => prev.map(app => 
            app._id === appId ? { ...app, status: newStatus } : app
        ));
    } catch (err) {
        alert('Error updating status');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', width: '100%', margin: '0 auto', textAlign: 'left' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>My Posted Jobs</h2>
        {/* Shortcut Button to Post Job */}
        <button onClick={() => navigate('/post-job')} style={{ background: '#61dafb', color: 'black', padding: '10px 20px', borderRadius: '5px', border: 'none', fontWeight: 'bold' }}>
          + Post New Job
        </button>
      </div>

      {myJobs.length === 0 ? <p>No jobs posted yet.</p> : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {myJobs.map((job) => (
            <div key={job._id} style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#61dafb' }}>{job.title}</h3>
                <small style={{ color: '#aaa' }}>{job.location} | Posted: {new Date(job.postedAt).toLocaleDateString()}</small>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => viewApplications(job._id)} style={{ background: '#4CAF50', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px' }}>
                  View Apps
                </button>
                <button onClick={() => handleDeleteJob(job._id)} style={{ background: '#d9534f', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedJobApps && (
        <div style={{ marginTop: '30px', background: '#222', padding: '20px', borderRadius: '10px', border: '1px solid #61dafb' }}>
          <h3>Applicants Management</h3>
          {selectedJobApps.length === 0 ? <p>No applications yet.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #555', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th style={{ padding: '10px' }}>Email</th>
                  <th style={{ padding: '10px' }}>Resume</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedJobApps.map((app) => (
                  <tr key={app._id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '10px' }}>{app.candidate.name}</td>
                    <td style={{ padding: '10px' }}>{app.candidate.email}</td>
                    <td style={{ padding: '10px' }}>
                      <a href={`http://localhost:5000/${app.resume}`} target="_blank" rel="noopener noreferrer" style={{ color: '#61dafb' }}>Download</a>
                    </td>
                    <td style={{ padding: '10px', color: app.status === 'shortlisted' ? 'lightgreen' : app.status === 'rejected' ? 'red' : 'orange' }}>
                        {app.status.toUpperCase()}
                    </td>
                    <td style={{ padding: '10px' }}>
                        {app.status === 'applied' && (
                            <>
                                <button onClick={() => updateStatus(app._id, 'shortlisted')} style={{ background: 'green', color: 'white', marginRight: '5px', padding: '5px' }}>✓</button>
                                <button onClick={() => updateStatus(app._id, 'rejected')} style={{ background: 'red', color: 'white', padding: '5px' }}>✕</button>
                            </>
                        )}
                        {app.status !== 'applied' && <span>Done</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button onClick={() => setSelectedJobApps(null)} style={{ marginTop: '15px', background: '#9e0606', padding: '8px 15px', border: 'none', borderRadius: '5px' }}>Close</button>
        </div>
      )}
    </div>
  );
}

export default EmployerDashboard;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyApps = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/api/applications/my-applications', {
          headers: { 'x-auth-token': token }
        });
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };
    fetchMyApps();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>My Applied Jobs</h2>

      {applications.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#aaa' }}>
          <p>You haven't applied to any jobs yet.</p>
          <button onClick={() => navigate('/')} style={{ padding: '10px 20px', background: '#61dafb', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Find Jobs
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {applications.map((app) => (
            <div key={app._id} style={{ 
              background: '#2a2a2a', 
              padding: '20px', 
              borderRadius: '10px', 
              border: '1px solid #444',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              
              {/* Job Details */}
              <div>
                {app.job ? (
                  <>
                    <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>{app.job.title}</h3>
                    <p style={{ margin: 0, color: '#aaa' }}>{app.job.company} • {app.job.location}</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </>
                ) : (
                  <p style={{ color: 'red' }}>Job no longer exists</p>
                )}
              </div>

              {/* Status Badge */}
              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  padding: '8px 15px', 
                  borderRadius: '20px', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  background: app.status === 'shortlisted' ? 'green' : app.status === 'rejected' ? 'red' : '#d69e2e',
                  color: 'white'
                }}>
                  {app.status.toUpperCase()}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppliedJobs;
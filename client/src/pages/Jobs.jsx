import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobs');
        setJobs(res.data);
      } catch (err) {
        console.log("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleApply = async (jobId) => {
    if (!isLoggedIn) {
      alert("Please Login to Apply!");
      navigate('/login');
      return;
    }
    if (!selectedFile) {
      alert("Please select a Resume (PDF) first!");
      return;
    }
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/applications/${jobId}`, formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Application Submitted Successfully!");
      setSelectedFile(null);
    } catch (err) {
      alert('Error applying: ' + (err.response?.data?.msg || 'Server Error'));
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Available Jobs</h2>

      {/* Search Bar */}
      <input 
        type="text" 
        placeholder="Search for jobs (e.g. Java, Chennai, Google)..." 
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ 
          width: '96.5%', 
          padding: '15px', 
          fontSize: '16px', 
          marginBottom: '30px', 
          borderRadius: '8px', 
          border: '1px solid #555',
          background: '#222',
          color: 'white'
        }}
      />

      {/* Job List */}
      <div style={{ display: 'grid', gap: '25px' }}>
        {filteredJobs.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa' }}>No jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} style={{ 
              background: '#2a2a2a', 
              padding: '25px', 
              borderRadius: '10px', 
              border: '1px solid #444',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#61dafb' }}>{job.title}</h3>
                <p style={{ margin: '0 0 5px 0', color: '#eee' }}><strong>{job.company}</strong> • {job.location}</p>
                <p style={{ color: '#aaa', fontSize: '14px' }}>Salary: {job.salary}</p>
                <p style={{ marginTop: '10px', color: '#ccc', lineHeight: '1.5' }}>{job.description}</p>
              </div>
              
              <div style={{ borderTop: '1px solid #444', paddingTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#bbb' }}>Attach Resume (PDF):</label>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" style={{ color: '#aaa' }} />
                  <button 
                    onClick={() => handleApply(job._id)} 
                    style={{ 
                      padding: '10px 25px', 
                      background: '#4CAF50', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px', 
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      marginLeft: 'auto'
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Jobs;
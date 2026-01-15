import { useState, useEffect } from 'react';
import axios from 'axios';

function CandidateDashboard() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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
    <div style={{ padding: '20px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Candidate Dashboard</h2>
      
      {/* Search Bar */}
      <input 
        type="text" 
        placeholder="Search by Job Title, Company, or Location..." 
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ 
          width: '100%', 
          padding: '12px', 
          fontSize: '16px', 
          marginBottom: '20px', 
          borderRadius: '5px', 
          border: '1px solid #61dafb',
          background: '#222',
          color: 'white'
        }}
      />

      <h3>Available Jobs ({filteredJobs.length})</h3>

      {filteredJobs.length === 0 ? (
        <p>No jobs found matching "{searchTerm}"</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px', width: '100%' }}>
          {filteredJobs.map((job) => (
            <div key={job._id} style={{ 
              background: '#444', 
              padding: '20px', 
              borderRadius: '10px', 
              textAlign: 'left',
              border: '1px solid #555'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#61dafb' }}>{job.title}</h3>
              <p><strong>Company:</strong> {job.company} | <strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
              <p style={{ background: '#333', padding: '10px', borderRadius: '5px' }}>{job.description}</p>
              
              <div style={{ marginTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Upload Resume (PDF):</label>
                <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" style={{ marginBottom: '10px' }} />
                <br />
                <button onClick={() => handleApply(job._id)} style={{ background: 'green', color: 'white', padding: '10px 20px' }}>
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CandidateDashboard;
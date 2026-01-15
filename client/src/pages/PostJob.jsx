import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostJob() {
  const [jobData, setJobData] = useState({ title: '', company: '', location: '', description: '', salary: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/jobs', jobData, {
        headers: { 'x-auth-token': token } 
      });
      alert('Job Posted Successfully!');
      // Job post aanavudane List page ku kootitu poidum
      navigate('/employer-dashboard');
    } catch (err) {
      alert('Error posting job');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Post a New Job</h2>
      
      <div style={{ background: '#333', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
        <form onSubmit={handlePostJob} style={{ display: 'grid', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Job Title</label>
            <input type="text" name="title" value={jobData.title} onChange={handleChange} required 
              style={{ width: '520px', padding: '10px', borderRadius: '5px', border: '1px solid #555', background: '#222', color: 'white' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Company Name</label>
            <input type="text" name="company" value={jobData.company} onChange={handleChange} required 
              style={{ width: '520px', padding: '10px', borderRadius: '5px', border: '1px solid #555', background: '#222', color: 'white' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Location</label>
            <input type="text" name="location" value={jobData.location} onChange={handleChange} required 
              style={{ width: '520px', padding: '10px', borderRadius: '5px', border: '1px solid #555', background: '#222', color: 'white' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Salary</label>
            <input type="text" name="salary" value={jobData.salary} onChange={handleChange} required 
              style={{ width: '520px', padding: '10px', borderRadius: '5px', border: '1px solid #555', background: '#222', color: 'white' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Job Description</label>
            <textarea name="description" value={jobData.description} onChange={handleChange} required 
              style={{ width: '520px', padding: '10px', borderRadius: '5px', border: '1px solid #555', background: '#222', color: 'white', height: '100px' }}></textarea>
          </div>

          <button type="submit" style={{ padding: '12px', background: '#61dafb', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
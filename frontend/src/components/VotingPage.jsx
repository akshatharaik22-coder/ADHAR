import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCandidates, castVote } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function VotingPage() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [voted, setVoted] = useState(false);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    getCandidates().then(setCandidates);
  }, [token, navigate]);

  const handleVote = async () => {
    if (!selected) { setMessage('Please select a candidate'); return; }
    const res = await castVote(selected, token);
    setMessage(res.message);
    if (res.message.includes('successfully')) {
      setVoted(true);
      logout();
      setTimeout(() => navigate('/results'), 2000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Cast Your Vote</h2>
        <p style={styles.sub}>Select one candidate below</p>
        {candidates.map((c) => (
          <div
            key={c.id}
            style={{ ...styles.option, border: selected === c.id ? '2px solid #4f46e5' : '1px solid #ddd' }}
            onClick={() => !voted && setSelected(c.id)}
          >
            <strong>{c.name}</strong>
            <span style={{ color: '#888', fontSize: '13px', marginLeft: '8px' }}>{c.party}</span>
          </div>
        ))}
        {!voted && (
          <button style={styles.btn} onClick={handleVote}>Submit Vote</button>
        )}
        {message && <p style={styles.msg}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#f0f4ff' },
  card: { background:'#fff', padding:'2rem', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'400px' },
  title: { color:'#1a1a2e', fontSize:'22px', marginBottom:'4px', textAlign:'center' },
  sub: { color:'#666', fontSize:'14px', marginBottom:'1.5rem', textAlign:'center' },
  option: { padding:'14px', borderRadius:'8px', marginBottom:'10px', cursor:'pointer', transition:'border 0.2s' },
  btn: { width:'100%', padding:'12px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', fontSize:'16px', cursor:'pointer', marginTop:'1rem' },
  msg: { marginTop:'1rem', color:'#555', fontSize:'14px', textAlign:'center' },
};
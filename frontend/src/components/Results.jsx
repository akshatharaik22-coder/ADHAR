import { useEffect, useState } from 'react';
import { getResults } from '../utils/api';

export default function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => { getResults().then(setResults); }, []);

  const max = results[0]?.vote_count || 1;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Election Results</h2>
        {results.map((r, i) => (
          <div key={i} style={styles.row}>
            <div style={styles.nameRow}>
              <span>{r.name} — {r.party}</span>
              <strong>{r.vote_count} votes</strong>
            </div>
            <div style={styles.barBg}>
              <div style={{ ...styles.bar, width: `${(r.vote_count / max) * 100}%`, background: i === 0 ? '#4f46e5' : '#a5b4fc' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#f0f4ff' },
  card: { background:'#fff', padding:'2rem', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'440px' },
  title: { color:'#1a1a2e', fontSize:'22px', marginBottom:'1.5rem', textAlign:'center' },
  row: { marginBottom:'1.25rem' },
  nameRow: { display:'flex', justifyContent:'space-between', fontSize:'14px', marginBottom:'6px' },
  barBg: { background:'#eee', borderRadius:'6px', height:'10px' },
  bar: { height:'10px', borderRadius:'6px', transition:'width 0.5s' },
};
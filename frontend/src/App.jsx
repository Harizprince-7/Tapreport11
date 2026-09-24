import { Routes, Route, Link } from 'react-router-dom';
import ReportForm from './components/ReportForm';
import AdminMap from './components/AdminMap';

function App() {
  return (
    <div>
      <nav style={{ padding: '10px', background: '#0056b3', color: 'white', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, display: 'inline-block', marginRight: '20px' }}>Tap Report</h1>
        <Link to="/" style={{ color: 'white', marginRight: '15px' }}>Report Issue</Link>
        <Link to="/admin" style={{ color: 'white' }}>Admin Map</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ReportForm />} />
        <Route path="/admin" element={<AdminMap />} />
      </Routes>
    </div>
  );
}

export default App;
import { useState } from 'react';
import { Database, CheckCircle, AlertCircle, Copy, Check, ExternalLink, X, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function DatabaseModal({ isOpen, onClose }) {
  const { dbInfo, fetchDbStatus } = useAuth();
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const sampleAtlasUri = 'MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/rescuenow?retryWrites=true&w=majority';

  function copyToClipboard() {
    navigator.clipboard.writeText(sampleAtlasUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRefresh() {
    setTesting(true);
    await fetchDbStatus();
    setTimeout(() => setTesting(false), 600);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card db-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="db-modal-title">
            <Database size={22} className="accent-icon" />
            <div>
              <h3>Database Connection Manager</h3>
              <p>Manage MongoDB Atlas & Local Database connectivity</p>
            </div>
          </div>
          <button className="icon-btn-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="db-status-banner">
          <div className="status-badge-row">
            <span className={`status-pill ${dbInfo.connected ? 'connected' : 'fallback'}`}>
              <span className="dot" />
              {dbInfo.connected ? 'MongoDB Connected' : 'Resilient In-Memory Storage Active'}
            </span>
            <button className="btn-refresh" onClick={handleRefresh} disabled={testing}>
              <RefreshCw size={14} className={testing ? 'spin' : ''} /> Test Connection
            </button>
          </div>

          <p className="status-desc">
            {dbInfo.connected
              ? `Connected to database: ${dbInfo.uri || 'mongodb://127.0.0.1:27017/rescuenow'}. All bookings, vehicles, and user accounts are persisted.`
              : 'The system is running smoothly using the built-in development data store. All search, booking, tracking, and provider features work 100% out of the box.'}
          </p>
        </div>

        <div className="db-instructions">
          <h4>How to connect your Free MongoDB Atlas (Cloud Database):</h4>
          <ol>
            <li>
              Go to <a href="https://www.mongodb.com/cloud/atlas/register" target="_blank" rel="noreferrer">MongoDB Atlas (Free M0 Cluster) <ExternalLink size={12} /></a> and create a free project.
            </li>
            <li>
              Create a Database User and allow network access (<code>0.0.0.0/0</code>).
            </li>
            <li>
              Click <b>Connect &gt; Drivers</b> and copy your connection string.
            </li>
            <li>
              Open <code>server/.env</code> in your project and replace <code>MONGODB_URI</code>:
            </li>
          </ol>

          <div className="code-box">
            <code>{sampleAtlasUri}</code>
            <button className="copy-btn" onClick={copyToClipboard}>
              {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>

          <div className="local-hint">
            <strong>Or Local MongoDB:</strong> If you have MongoDB installed locally, start it via <code>mongod</code> in PowerShell or start the Windows MongoDB service.
          </div>
        </div>

        <div className="modal-actions">
          <button className="button button-primary" onClick={onClose}>
            Got it, continue testing
          </button>
        </div>
      </div>
    </div>
  );
}

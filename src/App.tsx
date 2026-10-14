import { useState } from 'react';
import { useApplications } from './features/applications/useApplications';
import { STATUSES } from './features/applications/types';
import type { Application, Status } from './features/applications/types';

/**
 * Minimal demo UI for Phase 1.
 * Proves that add, edit and delete work and survive a page refresh.
 * Will be replaced by proper UI in Phase 2.
 */
function App() {
  const { applications, isLoading, addApplication, editApplication, deleteApplication } =
    useApplications();

  // ---- form state ---------------------------------------------------------
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<Status>('applied');

  // ---- edit mode ----------------------------------------------------------
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCompany, setEditCompany] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editStatus, setEditStatus] = useState<Status>('applied');

  // ---- handlers -----------------------------------------------------------
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    await addApplication({
      company: company.trim(),
      role: role.trim(),
      status,
      appliedAt: new Date().toISOString(),
    });

    setCompany('');
    setRole('');
    setStatus('applied');
  };

  const startEdit = (app: Application) => {
    setEditingId(app.id);
    setEditCompany(app.company);
    setEditRole(app.role);
    setEditStatus(app.status);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (app: Application) => {
    await editApplication({
      ...app,
      company: editCompany.trim(),
      role: editRole.trim(),
      status: editStatus,
    });
    setEditingId(null);
  };

  // ---- render -------------------------------------------------------------
  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading applications…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Job Application Tracker</h1>

      {/* ---- Add form ---- */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          style={{ padding: '0.5rem', flex: 1, minWidth: 120 }}
        />
        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={{ padding: '0.5rem', flex: 1, minWidth: 120 }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          style={{ padding: '0.5rem' }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          + Add
        </button>
      </form>

      {/* ---- Applications list ---- */}
      {applications.length === 0 ? (
        <p style={{ color: '#888' }}>No applications yet. Add one above!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Company</th>
              <th style={{ padding: '0.5rem' }}>Role</th>
              <th style={{ padding: '0.5rem' }}>Status</th>
              <th style={{ padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                {editingId === app.id ? (
                  <>
                    <td style={{ padding: '0.5rem' }}>
                      <input
                        value={editCompany}
                        onChange={(e) => setEditCompany(e.target.value)}
                        style={{ padding: '0.25rem', width: '100%' }}
                      />
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <input
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        style={{ padding: '0.25rem', width: '100%' }}
                      />
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as Status)}
                        style={{ padding: '0.25rem' }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <button onClick={() => handleSaveEdit(app)} style={{ marginRight: '0.5rem' }}>
                        Save
                      </button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '0.5rem' }}>{app.company}</td>
                    <td style={{ padding: '0.5rem' }}>{app.role}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <span
                        style={{
                          padding: '0.15rem 0.5rem',
                          borderRadius: '0.75rem',
                          fontSize: '0.85rem',
                          background:
                            app.status === 'applied' ? '#dbeafe'
                            : app.status === 'interview' ? '#fef3c7'
                            : app.status === 'offer' ? '#d1fae5'
                            : '#fee2e2',
                          color:
                            app.status === 'applied' ? '#1e40af'
                            : app.status === 'interview' ? '#92400e'
                            : app.status === 'offer' ? '#065f46'
                            : '#991b1b',
                        }}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <button onClick={() => startEdit(app)} style={{ marginRight: '0.5rem' }}>
                        Edit
                      </button>
                      <button onClick={() => deleteApplication(app.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#888' }}>
        {applications.length} application{applications.length !== 1 ? 's' : ''} · Data is stored in IndexedDB and survives page refresh.
      </p>
    </div>
  );
}

export default App;

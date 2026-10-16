import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';

type QueueStatus = 'PENDING' | 'VALIDATED' | 'NO ISSUES' | 'WARNING' | 'ERROR' | 'NOTIFIED';
type ValidationBatch = {
  id: string; dataset: string; rule: string; description: string; category: string;
  department: string; records: number; issues: number; status: QueueStatus;
};

const INITIAL_QUEUE: ValidationBatch[] = [
  { id: 'VAL-2609-014', dataset: 'Enrollees_AY2026_Masterlist.csv', rule: 'Required field integrity', description: 'Student ID and program code schema', category: 'Enrollment', department: 'Registrar', records: 10000, issues: 3, status: 'ERROR' },
  { id: 'VAL-2609-013', dataset: 'Faculty_Registry_S1.xlsx', rule: 'Employment status mapping', description: 'Standardize appointment values', category: 'Faculty', department: 'Human Resources', records: 240, issues: 2, status: 'WARNING' },
  { id: 'VAL-2609-012', dataset: 'Admissions_Survey_2026.csv', rule: 'Admissions survey schema', description: 'All required columns detected', category: 'Admissions', department: 'Admissions', records: 8420, issues: 0, status: 'NO ISSUES' },
  { id: 'VAL-2609-011', dataset: 'COE_Student_Update.xlsx', rule: 'Student identity uniqueness', description: 'Duplicate identifiers require revision', category: 'Enrollment', department: 'COE', records: 2500, issues: 4, status: 'NOTIFIED' },
  { id: 'VAL-2609-010', dataset: 'Scholarship_Grants.csv', rule: 'Grant reference codes', description: 'Validation and ingestion complete', category: 'Student Aid', department: 'Student Affairs', records: 3950, issues: 0, status: 'VALIDATED' },
];

const ISSUE_ROWS = [
  { row: 1043, studentId: '20-2121', program: 'BSIS', value: 'INVALID_TAG', issue: "Invalid Gender Tag 'INVALID_TAG'" },
  { row: 1044, studentId: '—', program: 'BSCS', value: 'MISSING', issue: 'Required Student ID is missing' },
  { row: 1046, studentId: '23-8882', program: 'BSECT', value: 'BSECT', issue: "Unknown program code 'BSECT'" },
];

const STATUS_TONE: Record<QueueStatus, string> = {
  PENDING: 'bg-golden/20 text-obsidian', VALIDATED: 'bg-coa/10 text-coa',
  'NO ISSUES': 'bg-coa/10 text-coa', WARNING: 'bg-golden/20 text-obsidian',
  ERROR: 'bg-obsidian/10 text-obsidian', NOTIFIED: 'bg-lilac/20 text-primary',
};

export default function DataValidation() {
  const { showModal, showToast } = useApp();
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [filter, setFilter] = useState<'ALL' | QueueStatus>('ALL');
  const [reviewing, setReviewing] = useState<ValidationBatch | null>(null);
  const [feedback, setFeedback] = useState('');

  const metrics = useMemo(() => [
    { label: 'Total Pending', key: 'PENDING' as QueueStatus, value: queue.filter(q => ['PENDING', 'WARNING', 'ERROR'].includes(q.status)).length },
    { label: 'Passed / Validated', key: 'VALIDATED' as QueueStatus, value: queue.filter(q => q.status === 'VALIDATED').length },
    { label: 'No Issues', key: 'NO ISSUES' as QueueStatus, value: queue.filter(q => q.status === 'NO ISSUES').length },
    { label: 'Warnings', key: 'WARNING' as QueueStatus, value: queue.filter(q => q.status === 'WARNING').length },
    { label: 'Errors', key: 'ERROR' as QueueStatus, value: queue.filter(q => q.status === 'ERROR').length },
    { label: 'Notified', key: 'NOTIFIED' as QueueStatus, value: queue.filter(q => q.status === 'NOTIFIED').length },
  ], [queue]);

  const visible = filter === 'ALL'
    ? queue
    : filter === 'PENDING'
      ? queue.filter(q => ['PENDING', 'WARNING', 'ERROR'].includes(q.status))
      : queue.filter(q => q.status === filter);

  function ingest(batch: ValidationBatch) {
    showModal({
      title: 'Ingest Validated Dataset',
      message: `Commit ${batch.records.toLocaleString()} records from “${batch.dataset}” to the live analytics database? Executive visualizations will update immediately and this action will be logged.`,
      confirmLabel: 'Ingest Dataset',
      onConfirm: () => {
        setQueue(q => q.map(item => item.id === batch.id ? { ...item, status: 'VALIDATED', issues: 0 } : item));
        setReviewing(null);
        showToast({ type: 'success', title: 'Dataset ingested', body: `${batch.id} is now live across executive dashboards.` });
      },
    });
  }

  function notify(batch: ValidationBatch) {
    if (!feedback.trim()) {
      showToast({ type: 'warning', title: 'Feedback required', body: 'Enter correction instructions before notifying the data owner.' });
      return;
    }
    showModal({
      title: 'Send Validation Feedback',
      message: `Send this correction request to ${batch.department}? A feedback thread will appear in their Import Data workspace.`,
      confirmLabel: 'Send Feedback',
      onConfirm: () => {
        setQueue(q => q.map(item => item.id === batch.id ? { ...item, status: 'NOTIFIED' } : item));
        setReviewing(null);
        setFeedback('');
        showToast({ type: 'success', title: 'Data owner notified', body: 'The correction thread is now active.' });
      },
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-6 gap-3">
        {metrics.map(metric => (
          <button key={metric.key} onClick={() => setFilter(filter === metric.key ? 'ALL' : metric.key)}
            className={`rounded-2xl p-4 text-left border transition-all ${filter === metric.key ? 'border-lilac bg-lilac/10 shadow-lg' : 'border-lilac/20 bg-white hover:-translate-y-0.5'}`}>
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted">{metric.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-2xl font-bold text-primary">{metric.value}</p>
              <span className="w-2 h-2 rounded-full bg-lilac" />
            </div>
          </button>
        ))}
      </div>

      <section className="rounded-3xl bg-white border border-lilac/20 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-lilac/15">
          <div>
            <p className="text-base font-bold text-primary">Validation inspection queue</p>
            <p className="text-xs text-muted mt-1">Department submissions are isolated from the live database until approved.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-primary/[0.03] text-muted">
              <tr>{['Status', 'Data record ingested', 'Rule & description', 'Category', 'Department', 'Checked', 'Issues', 'Action'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody>
              {visible.map(batch => (
                <tr key={batch.id} className="border-t border-lilac/10 hover:bg-blossom/20">
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-[9px] font-bold whitespace-nowrap ${STATUS_TONE[batch.status]}`}>{batch.status}</span></td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-primary whitespace-nowrap">{batch.dataset}</p>
                    <p className="font-mono text-[10px] text-muted mt-0.5">{batch.id}</p>
                  </td>
                  <td className="px-4 py-3 min-w-56"><p className="font-semibold text-primary">{batch.rule}</p><p className="text-muted mt-0.5">{batch.description}</p></td>
                  <td className="px-4 py-3 text-muted">{batch.category}</td>
                  <td className="px-4 py-3 text-primary font-medium">{batch.department}</td>
                  <td className="px-4 py-3 font-mono text-muted">{batch.records.toLocaleString()}</td>
                  <td className="px-4 py-3 font-bold text-obsidian">{batch.issues}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => { setReviewing(batch); setFeedback(''); }}
                      className="rounded-lg px-3 py-1.5 font-bold bg-lilac/15 text-primary hover:bg-lilac/30">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {reviewing && (
        <div className="modal-backdrop fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm" onClick={() => setReviewing(null)}>
          <div className="modal-content bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 bg-primary text-white rounded-t-3xl flex items-start justify-between">
              <div><p className="text-[10px] uppercase tracking-widest font-bold text-lilac">Schema review · {reviewing.id}</p><p className="text-lg font-bold mt-1">{reviewing.dataset}</p><p className="text-xs text-white/60 mt-1">Only rows containing errors or warnings are shown.</p></div>
              <button onClick={() => setReviewing(null)} className="rounded-xl p-2 bg-white/10 text-white" aria-label="Close review">×</button>
            </div>
            <div className="p-6 space-y-5">
              {reviewing.issues > 0 ? (
                <>
                  <div className="rounded-2xl border border-obsidian/15 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-obsidian/5 text-muted"><tr>{['Source row', 'Student ID', 'Program', 'Flagged value', 'Issue detail'].map(h => <th key={h} className="p-3 text-left">{h}</th>)}</tr></thead>
                      <tbody>{ISSUE_ROWS.slice(0, Math.min(reviewing.issues, ISSUE_ROWS.length)).map(row => <tr key={row.row} className="border-t border-obsidian/10"><td className="p-3 font-mono">Row {row.row}</td><td className="p-3">{row.studentId}</td><td className="p-3">{row.program}</td><td className="p-3 font-mono text-obsidian">{row.value}</td><td className="p-3 text-obsidian font-medium">{row.issue}</td></tr>)}</tbody>
                    </table>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-primary">Correction instructions to {reviewing.department}</label>
                    <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={3}
                      placeholder="Example: Row 1043 contains an invalid gender tag. Correct the source CSV and re-upload."
                      className="mt-2 w-full rounded-2xl border border-lilac/30 bg-surface p-3 text-sm text-primary outline-none focus:border-lilac" />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setReviewing(null)} className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-primary/5 text-primary">Cancel</button>
                    <button onClick={() => notify(reviewing)} className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-lilac text-primary">Notify data owner</button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-2xl bg-coa/10 text-coa flex items-center justify-center mx-auto mb-3">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <p className="font-bold text-primary">All schema checks passed</p>
                  <p className="text-sm text-muted mt-1">{reviewing.records.toLocaleString()} records are ready for database integration.</p>
                  <button onClick={() => ingest(reviewing)} className="mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold bg-primary text-white">Ingest to live database</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

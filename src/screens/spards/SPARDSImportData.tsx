import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';

type Dataset = 'QCYDO' | 'UNIFAST/TES' | 'CHED' | 'LGU/Private';
type ValidationStatus = 'VALID' | 'ERROR' | 'WARNING';
type RequestStatus = 'Pending' | 'Validated' | 'Requires Action';

interface PreviewRow {
  row: string;
  studentId: string;
  name: string;
  grant: string;
  gpa: string;
  status: ValidationStatus;
}

interface ValidationRequest {
  id: string;
  filename: string;
  dataset: string;
  status: RequestStatus;
  date: string;
  rows: number;
}

const PREVIEW_ROWS: PreviewRow[] = [
  { row: '001', studentId: '23-2652', name: 'Naya Alia', grant: 'QCYDO_FULL', gpa: '1.25', status: 'VALID' },
  { row: '002', studentId: '20-2121', name: 'Anastasha', grant: 'UNIFAST_TES', gpa: 'INVALID_GPA', status: 'ERROR' },
  { row: '003', studentId: '22-1089', name: 'Bryan Ramos', grant: 'QCYDO_FULL', gpa: '1.78', status: 'VALID' },
  { row: '004', studentId: '21-3340', name: 'Carla Santos', grant: 'CHED', gpa: '1.50', status: 'VALID' },
  { row: '005', studentId: '23-0789', name: 'Daniel Cruz', grant: 'QCYDO_FULL', gpa: '2.30', status: 'WARNING' },
  { row: '006', studentId: '22-5512', name: 'Elena Reyes', grant: 'LGU_PRIVATE', gpa: '1.95', status: 'VALID' },
  { row: '007', studentId: '20-4421', name: 'Franz Bautista', grant: 'UNIFAST_TES', gpa: '', status: 'ERROR' },
  { row: '008', studentId: '23-9900', name: 'Grace Lim', grant: 'QCYDO_FULL', gpa: '1.10', status: 'VALID' },
];

const ACTIVE_REQUESTS: ValidationRequest[] = [
  { id: 'REQ-204', filename: 'QCYDO_Scholars_AY2026.xlsx', dataset: 'QCYDO', status: 'Requires Action', date: '09/27/2026', rows: 4000 },
  { id: 'REQ-203', filename: 'UNIFAST_TES_Registry_AY2026.xlsx', dataset: 'UNIFAST/TES', status: 'Validated', date: '09/20/2026', rows: 2000 },
  { id: 'REQ-201', filename: 'CHED_Scholars_AY2025.xlsx', dataset: 'CHED', status: 'Pending', date: '09/15/2026', rows: 500 },
];

const DATASETS: Dataset[] = ['QCYDO', 'UNIFAST/TES', 'CHED', 'LGU/Private'];

const STATUS_STYLES: Record<ValidationStatus, string> = {
  VALID: 'bg-coa/10 text-coa',
  ERROR: 'bg-red-50 text-red-700',
  WARNING: 'bg-golden/15 text-amber-700',
};

const REQ_STYLES: Record<RequestStatus, string> = {
  Validated: 'bg-coa/10 text-coa',
  Pending: 'bg-lilac/15 text-primary',
  'Requires Action': 'bg-obsidian/10 text-obsidian',
};

export default function SPARDSImportData() {
  const { showToast, showModal } = useApp();
  const [dataset, setDataset] = useState<Dataset>('QCYDO');
  const [file, setFile] = useState<{ name: string; rows: number } | null>({ name: 'QCYDO_Scholars_Masterlist_AY2026.xlsx', rows: 4000 });
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const validCount = PREVIEW_ROWS.filter(r => r.status === 'VALID').length;
  const errorCount = PREVIEW_ROWS.filter(r => r.status === 'ERROR').length;
  const warnCount = PREVIEW_ROWS.filter(r => r.status === 'WARNING').length;

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile({ name: f.name, rows: Math.floor(Math.random() * 4000) + 500 });
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile({ name: f.name, rows: Math.floor(Math.random() * 4000) + 500 });
  }

  function handleRequestValidation() {
    if (errorCount > 0) {
      showModal({
        title: 'Schema Errors Detected',
        message: `${errorCount} row(s) contain errors that must be corrected in your master spreadsheet before submitting. Proceed anyway?`,
        confirmLabel: 'Submit with Errors',
        variant: 'danger',
        onConfirm: () => submitRequest(),
      });
    } else {
      submitRequest();
    }
  }

  function submitRequest() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showToast({ type: 'success', title: 'Validation Request Submitted', body: 'Your dataset has been queued for MIS Administrator review.' });
    }, 1200);
  }

  function handleViewThread(reqId: string) {
    showModal({
      title: `Discussion Thread — ${reqId}`,
      message: 'Admin Reviewer (Sep 27): "Row 002 has an invalid GPA value. Please correct and re-upload." — SPARDS Head (Sep 28): "Noted, will re-submit with corrected masterlist."',
      confirmLabel: 'Close',
      onConfirm: () => {},
    });
  }

  return (
    <div className="space-y-5">
      {/* Dataset selector */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Target Dataset</p>
        <div className="flex flex-wrap gap-3">
          {DATASETS.map(d => (
            <button key={d} onClick={() => setDataset(d)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${dataset === d ? 'bg-primary text-white shadow-sm' : 'border border-lilac/20 text-muted hover:border-lilac hover:text-primary'}`}>
              {d} Scholar Masterlist
            </button>
          ))}
        </div>
      </div>

      {/* Upload zone */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Drag & Drop Master CSV / XLSX File</p>
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`drop-zone cursor-pointer rounded-2xl p-8 flex flex-col items-center gap-3 transition-all ${dragging ? 'drag-over' : ''}`}>
          <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileInput} />
          {file ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-coa/10 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#00875A" strokeWidth="1.6"/><path d="M14 2v6h6" stroke="#00875A" strokeWidth="1.6"/></svg>
              </div>
              <p className="text-sm font-bold text-primary">{file.name}</p>
              <p className="text-xs text-coa font-semibold">{file.rows.toLocaleString()} rows detected</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-lilac/10 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 16V3m0 0L7 8m5-5l5 5M4 15v5h16v-5" stroke="#BB96E4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className="text-sm font-semibold text-primary">Drop your {dataset} masterlist here</p>
              <p className="text-xs text-muted">Accepts .XLSX and .CSV formats</p>
            </>
          )}
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => { setFile(null); fileRef.current?.click(); }}
            className="rounded-xl border border-lilac/25 px-4 py-2 text-xs font-semibold text-primary hover:bg-lilac/10 transition-colors flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Replace File
          </button>
          <button onClick={handleRequestValidation} disabled={!file || submitting}
            className="ml-auto rounded-xl px-6 py-2 text-xs font-bold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm">
            {submitting ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 16V3m0 0L7 8m5-5l5 5M4 15v5h16v-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            Request Validation
          </button>
        </div>
      </div>

      {/* Schema preview */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-lilac/10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-bold text-primary">Schema Validation Preview</p>
            <p className="text-xs text-muted mt-0.5">Read-only — correct errors in your master spreadsheet</p>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-coa font-semibold"><span className="w-2 h-2 rounded-full bg-coa" />{validCount} Valid</span>
            <span className="flex items-center gap-1.5 text-red-600 font-semibold"><span className="w-2 h-2 rounded-full bg-red-500" />{errorCount} Errors</span>
            <span className="flex items-center gap-1.5 text-amber-600 font-semibold"><span className="w-2 h-2 rounded-full bg-golden" />{warnCount} Warnings</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface border-b border-lilac/10">
                <th className="px-4 py-3 text-left font-semibold text-muted">Row #</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Student ID</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Full Name</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Grant Type</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Current GPA</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Parsing Status</th>
              </tr>
            </thead>
            <tbody>
              {PREVIEW_ROWS.map(r => (
                <tr key={r.row} className="border-b border-lilac/5 hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-mono text-muted">Row {r.row}</td>
                  <td className="px-4 py-3 font-mono text-primary">{r.studentId}</td>
                  <td className="px-4 py-3 font-medium text-primary">{r.name}</td>
                  <td className="px-4 py-3 text-muted">{r.grant}</td>
                  <td className={`px-4 py-3 font-mono ${r.status === 'ERROR' ? 'text-red-600 font-bold' : 'text-primary'}`}>{r.gpa || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active validation requests */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5 space-y-3">
        <p className="text-sm font-bold text-primary">Active Validation Requests</p>
        {ACTIVE_REQUESTS.map(req => (
          <div key={req.id} className="rounded-xl border border-lilac/15 bg-surface p-4 flex items-center gap-4 flex-wrap">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#200D2D" strokeWidth="1.6"/><path d="M14 2v6h6" stroke="#200D2D" strokeWidth="1.6"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-primary truncate">{req.id}: {req.filename}</p>
              <p className="text-[10px] text-muted mt-0.5">{req.dataset} · {req.rows.toLocaleString()} rows · Submitted {req.date}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${REQ_STYLES[req.status]}`}>{req.status}</span>
            {req.status === 'Requires Action' && (
              <button onClick={() => handleViewThread(req.id)} className="rounded-xl px-3 py-1.5 text-[11px] font-semibold bg-primary text-white hover:bg-primary/90 transition-colors whitespace-nowrap">
                View Thread
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

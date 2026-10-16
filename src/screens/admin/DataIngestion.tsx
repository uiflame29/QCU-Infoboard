import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';

type ValidationRow = {
  row: number;
  studentId: string;
  programCode: string;
  genderTag: string;
  income: string;
  status: 'VALID' | 'ERROR';
  error?: string;
};

const MOCK_ROWS: ValidationRow[] = [
  { row: 1041, studentId: '23-2651', programCode: 'BSIT',  genderTag: 'FEMALE',      income: 'Low',    status: 'VALID' },
  { row: 1042, studentId: '23-2652', programCode: 'BSIT',  genderTag: 'FEMALE',      income: 'Low',    status: 'VALID' },
  { row: 1043, studentId: '20-2121', programCode: 'BSIS',  genderTag: 'INVALID_TAG', income: 'Middle', status: 'ERROR', error: 'Invalid gender tag value' },
  { row: 1044, studentId: '',        programCode: 'BSCS',  genderTag: 'MALE',        income: 'Low',    status: 'ERROR', error: 'Missing Student ID' },
  { row: 1045, studentId: '24-0321', programCode: 'BSCS',  genderTag: 'MALE',        income: 'Low',    status: 'VALID' },
  { row: 1046, studentId: '23-8882', programCode: 'BSECT', genderTag: 'FEMALE',      income: 'Middle', status: 'ERROR', error: 'Unknown program code: BSECT' },
  { row: 1047, studentId: '22-4451', programCode: 'BSA',   genderTag: 'FEMALE',      income: 'Low',    status: 'VALID' },
];

type DatasetType = 'Registrar Student Masterlist' | 'HR Faculty Registry' | 'Admissions Survey';

export default function DataIngestion() {
  const { showModal, showToast } = useApp();
  const [uploaded, setUploaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [datasetType, setDatasetType] = useState<DatasetType>('Registrar Student Masterlist');
  const [rows, setRows] = useState<ValidationRow[]>(MOCK_ROWS);
  const [editingCell, setEditingCell] = useState<{row: number; field: string} | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const errorCount = rows.filter(r => r.status === 'ERROR').length;
  const validCount = rows.filter(r => r.status === 'VALID').length;

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    setUploaded(true);
  }

  function handleFileSelect() {
    fileRef.current?.click();
  }

  function handleFixError(rowNum: number, field: string, value: string) {
    setRows(prev => prev.map(r => {
      if (r.row !== rowNum) return r;
      const updated = { ...r, [field]: value };
      if (field === 'genderTag' && ['MALE', 'FEMALE', 'NON-BINARY'].includes(value.toUpperCase())) {
        updated.genderTag = value.toUpperCase();
        updated.status = 'VALID';
        updated.error = undefined;
      }
      if (field === 'studentId' && value.trim()) {
        updated.studentId = value;
        if (!updated.error?.includes('program')) {
          updated.status = 'VALID';
          updated.error = undefined;
        }
      }
      return updated;
    }));
    setEditingCell(null);
    showToast({ type: 'success', title: 'Cell Updated', body: 'Validation re-run automatically.' });
  }

  function handleCommit() {
    if (errorCount > 0) {
      showToast({ type: 'error', title: `${errorCount} error(s) remain`, body: 'Fix all errors before committing.' });
      return;
    }
    showModal({
      title: 'Commit Batch to Central Database',
      message: `Commit ${rows.length} validated rows from "${datasetType}" to the central analytics database? This action will update all dashboard visualizations and is logged to the audit trail.`,
      confirmLabel: 'Commit Batch',
      onConfirm: () => {
        showToast({ type: 'success', title: 'Data Committed Successfully', body: `${rows.length} rows ingested. Dashboard updated.` });
        setUploaded(false);
        setRows(MOCK_ROWS);
      },
    });
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: '0 2px 16px rgba(32,13,45,0.06)' }}>
        {/* Module header */}
        <div className="px-6 py-4 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, #200D2D, #3D1A55)', borderBottom: '1px solid rgba(187,150,228,0.2)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(187,150,228,0.2)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#BB96E4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 8 12 3 7 8" stroke="#FFD066" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="3" x2="12" y2="15" stroke="#FFD066" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p className="font-bold text-white">Batch Data Ingestion & Schema Validation Engine</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Upload, validate, and commit institutional master datasets</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Dataset type selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#7B6891' }}>Dataset Type</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(['Registrar Student Masterlist', 'HR Faculty Registry', 'Admissions Survey'] as DatasetType[]).map(t => (
                <button key={t} onClick={() => setDatasetType(t)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium"
                  style={{
                    background: datasetType === t ? '#200D2D' : 'rgba(32,13,45,0.05)',
                    color: datasetType === t ? '#FFFFFF' : '#7B6891',
                    border: `1.5px solid ${datasetType === t ? '#200D2D' : 'rgba(32,13,45,0.1)'}`,
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Drop zone */}
          <div
            className={`drop-zone p-8 text-center cursor-pointer ${dragOver ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={handleFileSelect}>
            <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden"
              onChange={() => setUploaded(true)} />
            {uploaded ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(0,135,90,0.1)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#00875A" strokeWidth="1.5" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" stroke="#00875A" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-sm font-semibold" style={{ color: '#00875A' }}>Enrollees_AY2026_Masterlist.csv</p>
                <p className="text-xs" style={{ color: '#7B6891' }}>10,000 rows detected · 47 columns parsed</p>
                <button onClick={e => { e.stopPropagation(); setUploaded(false); }}
                  className="text-xs" style={{ color: '#C0392B' }}>Remove file</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(187,150,228,0.1)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polyline points="16 16 12 12 8 16" stroke="#BB96E4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="12" x2="12" y2="21" stroke="#BB96E4" strokeWidth="1.5" strokeLinecap="round"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" stroke="#BB96E4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-sm font-semibold" style={{ color: '#200D2D' }}>Drag & Drop Master CSV / Excel File Here</p>
                <p className="text-xs" style={{ color: '#7B6891' }}>Supports .CSV and .XLSX formats · Max 50MB</p>
                <span className="mt-1 px-3 py-1 rounded-lg text-xs font-medium"
                  style={{ background: 'rgba(187,150,228,0.12)', color: '#BB96E4', border: '1px solid rgba(187,150,228,0.3)' }}>
                  Browse Files
                </span>
              </div>
            )}
          </div>

          {/* Validation preview */}
          {uploaded && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#200D2D' }}>
                    Schema Validation Preview Table
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: errorCount > 0 ? '#C0392B' : '#00875A' }}>
                    {errorCount > 0 ? `${errorCount} Error(s) Detected` : '✓ All rows valid — ready to commit'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: 'rgba(0,135,90,0.1)', color: '#00875A' }}>
                    {validCount} VALID
                  </span>
                  {errorCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: 'rgba(192,57,43,0.1)', color: '#C0392B' }}>
                      {errorCount} ERROR
                    </span>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(187,150,228,0.15)' }}>
                <table className="w-full text-xs">
                  <thead style={{ background: 'rgba(32,13,45,0.03)' }}>
                    <tr style={{ borderBottom: '1.5px solid rgba(187,150,228,0.15)' }}>
                      {['Row #', 'Student ID', 'Program Code', 'Gender Tag', 'Income', 'Status'].map(h => (
                        <th key={h} className="py-2.5 px-3 text-left font-semibold" style={{ color: '#7B6891' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={r.row}
                        style={{
                          borderBottom: '1px solid rgba(187,150,228,0.08)',
                          background: r.status === 'ERROR' ? 'rgba(192,57,43,0.03)' : 'transparent',
                        }}>
                        <td className="py-2.5 px-3 font-mono" style={{ color: '#7B6891' }}>Row {r.row}</td>
                        {/* Editable cells */}
                        {(['studentId', 'programCode', 'genderTag', 'income'] as const).map(field => (
                          <td key={field} className="py-2.5 px-3" style={{ color: '#200D2D' }}>
                            {editingCell?.row === r.row && editingCell.field === field ? (
                              <input
                                autoFocus
                                defaultValue={r[field]}
                                className="px-2 py-0.5 rounded text-xs outline-none w-full"
                                style={{ border: '1.5px solid #BB96E4', background: 'rgba(187,150,228,0.1)' }}
                                onBlur={e => handleFixError(r.row, field, e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleFixError(r.row, field, (e.target as HTMLInputElement).value);
                                  if (e.key === 'Escape') setEditingCell(null);
                                }}
                              />
                            ) : (
                              <span
                                className="cursor-pointer rounded px-1"
                                style={{ color: r.status === 'ERROR' && r.error?.toLowerCase().includes(field.toLowerCase().replace('id', 'id').replace('code', 'code').replace('tag', 'gender').replace('income', 'income')) ? '#C0392B' : undefined }}
                                onClick={() => setEditingCell({ row: r.row, field })}
                                title="Click to edit">
                                {r[field] || <span style={{ color: '#C0392B' }}>MISSING</span>}
                              </span>
                            )}
                          </td>
                        ))}
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'VALID' ? 'badge-active' : 'badge-frozen'}`}>
                            {r.status}{r.error ? ` — ${r.error}` : ''}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {errorCount > 0 && (
                <p className="text-[10px] mt-2" style={{ color: '#7B6891' }}>
                  ✏ Click any cell to edit it inline. Validation re-runs automatically after correction.
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          {uploaded && (
            <div className="flex items-center justify-between pt-2"
              style={{ borderTop: '1px solid rgba(187,150,228,0.12)' }}>
              <button
                onClick={() => showToast({ type: 'info', title: 'Focus mode', body: 'Jump to first error row.' })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(187,150,228,0.1)', color: '#BB96E4', border: '1px solid rgba(187,150,228,0.3)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Fix Errors In-Line
              </button>
              <button onClick={handleCommit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: errorCount > 0 ? 'rgba(32,13,45,0.2)' : '#200D2D',
                  color: '#FFFFFF',
                  cursor: errorCount > 0 ? 'not-allowed' : 'pointer',
                }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Commit Batch to Database
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

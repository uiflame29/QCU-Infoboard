import { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

type RegistrarDataset = 'Student / Enrollment Data' | 'Faculty Data' | 'Admission Data';
type ValidationStatus = 'VALID' | 'ERROR' | 'WARNING';
type RequestStatus = 'Pending' | 'Validated' | 'Requires Action';

interface PreviewRow {
  row: string;
  cells: string[];
  status: ValidationStatus;
}

interface DatasetConfig {
  filename: string;
  rows: number;
  columns: string[];
  preview: PreviewRow[];
}

interface ValidationRequest {
  id: string;
  filename: string;
  dataset: RegistrarDataset;
  status: RequestStatus;
  date: string;
  rows: number;
}

const DATASETS: Record<RegistrarDataset, DatasetConfig> = {
  'Student / Enrollment Data': {
    filename: 'Student_Enrollment_Masterlist_AY2026.xlsx',
    rows: 1250,
    columns: ['Student ID', 'Full Name', 'College', 'Program', 'Student Status'],
    preview: [
      { row: '012', cells: ['24-10021', 'Mikaela Alonzo', 'CCS', 'BSIT', 'REGULAR'], status: 'VALID' },
      { row: '013', cells: ['24-10022', 'Renzo Bautista', 'COE', 'INVALID_PROGRAM', 'REGULAR'], status: 'ERROR' },
      { row: '014', cells: ['24-10023', 'Angela Cruz', 'COA', 'BSA', 'IRREGULAR'], status: 'VALID' },
      { row: '015', cells: ['24-10024', 'Paolo Garcia', 'COB', 'BSEntrep', 'REGULAR'], status: 'VALID' },
      { row: '016', cells: ['[MISSING]', 'Sofia Lim', 'COED', 'BECEd', 'REGULAR'], status: 'WARNING' },
      { row: '017', cells: ['24-10026', 'Carmen Reyes', 'CCS', 'BSIS', 'GRADUATING'], status: 'VALID' },
      { row: '018', cells: ['24-10027', 'Andres Torres', 'COE', 'BSIE', 'REGULAR'], status: 'VALID' },
      { row: '019', cells: ['24-10021', 'Clara Villanueva', 'CCS', 'BSIT', 'DUPLICATE_ID'], status: 'ERROR' },
    ],
  },
  'Faculty Data': {
    filename: 'Registrar_Faculty_Registry_S1_AY2026.xlsx',
    rows: 342,
    columns: ['Faculty ID', 'Full Name', 'College', 'Program', 'Employment Type'],
    preview: [
      { row: '012', cells: ['FAC-1023', 'Dr. Maria Santos', 'CCS', 'BSIT', 'FULL-TIME'], status: 'VALID' },
      { row: '013', cells: ['FAC-1044', 'Prof. Alan Reyes', 'COE', 'BSECE', 'INVALID_TAG'], status: 'ERROR' },
      { row: '014', cells: ['FAC-1068', 'Dr. Liza Ramos', 'COED', 'BECEd', 'FULL-TIME'], status: 'VALID' },
      { row: '015', cells: ['FAC-1072', 'Prof. Ana Lim', 'COB', 'BSEntrep', 'PART-TIME'], status: 'VALID' },
      { row: '016', cells: ['FAC-1081', 'Prof. Paulo Garcia', 'COA', 'BSA', '[MISSING]'], status: 'WARNING' },
      { row: '017', cells: ['FAC-1090', 'Dr. Carmen Reyes', 'CCS', 'BSCS', 'FULL-TIME'], status: 'VALID' },
      { row: '018', cells: ['FAC-1102', 'Engr. Andres Torres', 'COE', 'BSCE', 'PART-TIME'], status: 'VALID' },
      { row: '019', cells: ['FAC-1044', 'Prof. Clara Cruz', 'COE', 'BSIE', 'DUPLICATE_ID'], status: 'ERROR' },
    ],
  },
  'Admission Data': {
    filename: 'Admissions_Applicant_Pipeline_AY2026.csv',
    rows: 5600,
    columns: ['Applicant ID', 'Full Name', 'College', 'Program', 'Admission Status'],
    preview: [
      { row: '012', cells: ['APP-260842', 'Angela Santos', 'CCS', 'BSIT', 'ACCEPTED'], status: 'VALID' },
      { row: '013', cells: ['APP-260913', 'Marco Reyes', 'COB', 'BSEntrep', 'QUALIFIED'], status: 'VALID' },
      { row: '014', cells: ['APP-261008', 'Sofia Garcia', 'COA', 'BSA', 'CONFIRMED'], status: 'VALID' },
      { row: '015', cells: ['APP-261044', 'Nathan Cruz', 'COE', 'BSCE', 'ENROLLED'], status: 'VALID' },
      { row: '016', cells: ['APP-261108', 'Camille Ramos', 'CCS', '[MISSING]', 'QUALIFIED'], status: 'WARNING' },
      { row: '017', cells: ['APP-261152', 'Joshua Aquino', 'COED', 'BECEd', 'ACCEPTED'], status: 'VALID' },
      { row: '018', cells: ['APP-261204', 'Alyssa Torres', 'COE', 'BSECE', 'INVALID_STATUS'], status: 'ERROR' },
      { row: '019', cells: ['APP-260842', 'Paolo Reyes', 'CCS', 'BSIS', 'DUPLICATE_ID'], status: 'ERROR' },
    ],
  },
};

const DATASET_OPTIONS = Object.keys(DATASETS) as RegistrarDataset[];

const INITIAL_REQUESTS: ValidationRequest[] = [
  { id: 'REQ-302', filename: 'Student_Enrollment_Masterlist_AY2026.xlsx', dataset: 'Student / Enrollment Data', status: 'Requires Action', date: '09/27/2026', rows: 1250 },
  { id: 'REQ-301', filename: 'Admissions_Applicant_Pipeline_AY2026.csv', dataset: 'Admission Data', status: 'Validated', date: '09/20/2026', rows: 5600 },
  { id: 'REQ-300', filename: 'Registrar_Faculty_Registry_S1_AY2026.xlsx', dataset: 'Faculty Data', status: 'Pending', date: '09/15/2026', rows: 342 },
];

const STATUS_STYLES: Record<ValidationStatus, string> = {
  VALID: 'bg-green-50 text-green-700',
  ERROR: 'bg-red-50 text-red-700',
  WARNING: 'bg-yellow-50 text-amber-700',
};

const REQUEST_STYLES: Record<RequestStatus, string> = {
  Validated: 'bg-green-50 text-green-700',
  Pending: 'bg-lilac/15 text-primary',
  'Requires Action': 'bg-red-50 text-red-700',
};

export default function ImportData() {
  const { currentUser, showModal, showToast } = useApp();
  const [dataset, setDataset] = useState<RegistrarDataset>('Student / Enrollment Data');
  const [file, setFile] = useState<{ name: string; rows: number } | null>({
    name: DATASETS['Student / Enrollment Data'].filename,
    rows: DATASETS['Student / Enrollment Data'].rows,
  });
  const [dragging, setDragging] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [requests, setRequests] = useState<ValidationRequest[]>(INITIAL_REQUESTS);
  const fileRef = useRef<HTMLInputElement>(null);

  const config = DATASETS[dataset];
  const validCount = config.preview.filter(row => row.status === 'VALID').length;
  const errorCount = config.preview.filter(row => row.status === 'ERROR').length;
  const warningCount = config.preview.filter(row => row.status === 'WARNING').length;

  function changeDataset(next: RegistrarDataset) {
    const nextConfig = DATASETS[next];
    setDataset(next);
    setFile({ name: nextConfig.filename, rows: nextConfig.rows });
    setValidated(false);
    setCommitted(false);
  }

  function useFile(nextFile: File) {
    setFile({ name: nextFile.name, rows: config.rows });
    setValidated(false);
    setCommitted(false);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);
    const dropped = event.dataTransfer.files[0];
    if (dropped) useFile(dropped);
  }

  function handleFileInput(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (selected) useFile(selected);
  }

  function requestValidation() {
    if (!file) return;
    if (errorCount > 0) {
      showModal({
        title: 'Schema Issues Detected',
        message: `${errorCount} error row(s) and ${warningCount} warning row(s) were found. Invalid records will remain isolated. Submit the file for Registrar validation review?`,
        confirmLabel: 'Submit for Validation',
        onConfirm: validateFile,
      });
      return;
    }
    validateFile();
  }

  function validateFile() {
    setValidating(true);
    window.setTimeout(() => {
      setValidating(false);
      setValidated(true);
      setRequests(previous => [{
        id: `REQ-${303 + previous.length}`,
        filename: file?.name ?? config.filename,
        dataset,
        status: 'Validated',
        date: '09/30/2026',
        rows: file?.rows ?? config.rows,
      }, ...previous]);
      showToast({
        type: 'success',
        title: 'Validation Preview Approved',
        body: `${validCount} preview rows passed. Error and warning records remain excluded from the import commit.`,
      });
    }, 900);
  }

  function confirmImport() {
    if (!file || !validated) return;
    showModal({
      title: 'Confirm Registrar Data Import',
      message: `Commit the valid records from “${file.name}” to institutional analytics? Invalid, warning, and duplicate records remain excluded. This action recalculates affected dashboards immediately.`,
      confirmLabel: 'Confirm Import',
      onConfirm: () => {
        setCommitted(true);
        showToast({
          type: 'success',
          title: 'Registrar Data Imported',
          body: `${dataset} was committed by ${currentUser?.name ?? 'the Registrar'}. Analytics and import history were updated.`,
        });
      },
    });
  }

  function openThread(request: ValidationRequest) {
    showModal({
      title: `Discussion Thread — ${request.id}`,
      message: `MIS Reviewer: “Review the highlighted ${request.dataset.toLowerCase()} schema issues, correct the source spreadsheet, and upload a revised file. Invalid records have not affected live analytics.”`,
      confirmLabel: 'Close',
      onConfirm: () => {},
    });
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-lilac/15 bg-white p-5 shadow-sm">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">Target Registrar Dataset</p>
        <div className="flex flex-wrap gap-3">
          {DATASET_OPTIONS.map(option => (
            <button
              type="button"
              key={option}
              onClick={() => changeDataset(option)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${dataset === option ? 'bg-primary text-white shadow-sm' : 'border border-lilac/20 text-muted hover:border-lilac hover:text-primary'}`}>
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-lilac/15 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Drag & Drop Registrar Master CSV / XLSX File</p>
        <div
          onDragOver={event => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-all ${dragging ? 'border-lilac bg-blossom/40' : 'border-lilac/30 hover:border-lilac hover:bg-blossom/20'}`}>
          <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileInput} />
          {file ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#16a34a" strokeWidth="1.6"/><path d="M14 2v6h6M9 13l2 2 4-4" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className="text-sm font-bold text-primary">{file.name}</p>
              <p className="text-xs font-semibold text-green-600">{file.rows.toLocaleString()} rows detected</p>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lilac/10">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 16V3m0 0L7 8m5-5l5 5M4 15v5h16v-5" stroke="#BB96E4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className="text-sm font-semibold text-primary">Drop your {dataset} file here</p>
              <p className="text-xs text-muted">Accepts .XLSX and .CSV formats — maximum 50 MB</p>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => { setFile(null); fileRef.current?.click(); }} className="flex items-center gap-2 rounded-xl border border-lilac/25 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-lilac/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Replace File
          </button>
          {!validated ? (
            <button type="button" onClick={requestValidation} disabled={!file || validating} className="ml-auto flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
              {validating ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 16V3m0 0L7 8m5-5l5 5M4 15v5h16v-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              {validating ? 'Validating…' : 'Request Validation'}
            </button>
          ) : (
            <button type="button" onClick={confirmImport} disabled={committed} className={`ml-auto rounded-xl px-6 py-2 text-xs font-bold shadow-sm ${committed ? 'cursor-default bg-green-50 text-green-700' : 'bg-primary text-white hover:bg-primary/90'}`}>
              {committed ? 'Import Committed' : 'Confirm Import'}
            </button>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-lilac/15 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-lilac/10 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-primary">Schema Validation Preview</p>
            <p className="mt-0.5 text-xs text-muted">Read-only — correct errors in your registrar source spreadsheet</p>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-green-600"><span className="h-2 w-2 rounded-full bg-green-500" />{validCount} Valid</span>
            <span className="flex items-center gap-1.5 font-semibold text-red-600"><span className="h-2 w-2 rounded-full bg-red-500" />{errorCount} Errors</span>
            <span className="flex items-center gap-1.5 font-semibold text-amber-600"><span className="h-2 w-2 rounded-full bg-yellow-400" />{warningCount} Warnings</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-lilac/10 bg-surface">
                <th className="px-4 py-3 text-left font-semibold text-muted">Row #</th>
                {config.columns.map(column => <th key={column} className="whitespace-nowrap px-4 py-3 text-left font-semibold text-muted">{column}</th>)}
                <th className="px-4 py-3 text-left font-semibold text-muted">Parsing Status</th>
              </tr>
            </thead>
            <tbody>
              {config.preview.map(previewRow => (
                <tr key={previewRow.row} className="border-b border-lilac/5 transition-colors hover:bg-surface">
                  <td className="px-4 py-3 font-mono text-muted">Row {previewRow.row}</td>
                  {previewRow.cells.map((cell, index) => (
                    <td key={`${previewRow.row}-${index}`} className={`whitespace-nowrap px-4 py-3 ${index === 0 ? 'font-mono' : index === 1 ? 'font-medium' : ''} ${cell.includes('INVALID') || cell.includes('DUPLICATE') ? 'font-bold text-red-600' : cell.includes('MISSING') ? 'text-amber-600' : 'text-primary'}`}>{cell}</td>
                  ))}
                  <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATUS_STYLES[previewRow.status]}`}>{previewRow.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-lilac/15 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold text-primary">Active Validation Requests</p>
        {requests.map(request => (
          <div key={request.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-lilac/15 bg-surface p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6" stroke="#200D2D" strokeWidth="1.6"/></svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-primary">{request.id}: {request.filename}</p>
              <p className="mt-0.5 text-[10px] text-muted">{request.dataset} · {request.rows.toLocaleString()} rows · Submitted {request.date}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${REQUEST_STYLES[request.status]}`}>{request.status}</span>
            {request.status === 'Requires Action' && <button type="button" onClick={() => openThread(request)} className="whitespace-nowrap rounded-xl bg-primary px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-primary/90">View Thread</button>}
            {request.status === 'Validated' && <button type="button" onClick={() => showToast({ type: 'success', title: 'Validation report opened', body: request.filename })} className="whitespace-nowrap rounded-xl border border-lilac/20 px-3 py-1.5 text-[11px] font-semibold text-primary hover:bg-blossom/30">View Report</button>}
          </div>
        ))}
      </section>
    </div>
  );
}

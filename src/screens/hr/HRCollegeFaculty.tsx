import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { ScreenId } from '../../types';

type College = 'CCS' | 'COA' | 'COB' | 'COE' | 'COED';

interface DeptRow {
  code: string;
  name: string;
  chair: string;
  count: number;
  ratio: string;
  avgLoad: string;
}

const COLLEGE_DATA: Record<College, { color: string; fullName: string; depts: DeptRow[] }> = {
  CCS: {
    color: '#333333',
    fullName: 'College of Computer Studies',
    depts: [
      { code: 'IT-DEPT', name: 'Information Technology', chair: 'Prof. M. Santos', count: 35, ratio: '42.1:1', avgLoad: '18 units' },
      { code: 'CS-DEPT', name: 'Computer Science', chair: 'Dr. R. Reyes', count: 25, ratio: '38.5:1', avgLoad: '18 units' },
      { code: 'IS-DEPT', name: 'Information Systems', chair: 'Prof. A. Cruz', count: 15, ratio: '40.0:1', avgLoad: '21 units' },
    ],
  },
  COA: {
    color: '#00875A',
    fullName: 'College of Accountancy',
    depts: [
      { code: 'ACCT-DEPT', name: 'Accountancy', chair: 'Dr. P. Dela Rosa', count: 25, ratio: '44.2:1', avgLoad: '18 units' },
      { code: 'AUDIT-DEPT', name: 'Auditing', chair: 'Prof. L. Bautista', count: 10, ratio: '38.0:1', avgLoad: '15 units' },
    ],
  },
  COB: {
    color: '#FFC700',
    fullName: 'College of Business',
    depts: [
      { code: 'BUS-DEPT', name: 'Business Administration', chair: 'Prof. R. Santiago', count: 28, ratio: '41.5:1', avgLoad: '18 units' },
      { code: 'ENT-DEPT', name: 'Entrepreneurship', chair: 'Dr. C. Villanueva', count: 12, ratio: '35.0:1', avgLoad: '15 units' },
    ],
  },
  COE: {
    color: '#FF6B00',
    fullName: 'College of Engineering',
    depts: [
      { code: 'EE-DEPT', name: 'Electrical Engineering', chair: 'Prof. A. Torres', count: 20, ratio: '45.0:1', avgLoad: '21 units' },
      { code: 'IE-DEPT', name: 'Industrial Engineering', chair: 'Dr. B. Reyes', count: 18, ratio: '42.3:1', avgLoad: '18 units' },
    ],
  },
  COED: {
    color: '#0052CC',
    fullName: 'College of Education',
    depts: [
      { code: 'ELEM-DEPT', name: 'Elementary Education', chair: 'Prof. M. Gonzales', count: 15, ratio: '38.7:1', avgLoad: '18 units' },
      { code: 'SEC-DEPT', name: 'Secondary Education', chair: 'Dr. F. Aquino', count: 15, ratio: '41.2:1', avgLoad: '18 units' },
      { code: 'BECED-DEPT', name: 'Early Childhood Education', chair: 'Prof. R. Castillo', count: 8, ratio: '30.0:1', avgLoad: '15 units' },
    ],
  },
};

const SCREEN_TO_COLLEGE: Record<ScreenId, College | null> = {
  'hr-college-ccs': 'CCS',
  'hr-college-coa': 'COA',
  'hr-college-cob': 'COB',
  'hr-college-coe': 'COE',
  'hr-college-coed': 'COED',
} as any;

interface RosterRow { name: string; empId: string; rank: string; status: string; }
const ROSTER_SAMPLE: RosterRow[] = [
  { name: 'Juan Dela Cruz', empId: 'EMP-23-0001', rank: 'Instructor I', status: 'Active' },
  { name: 'Maria Santos', empId: 'EMP-23-0002', rank: 'Instructor II', status: 'Active' },
  { name: 'Roberto Cruz', empId: 'EMP-23-0003', rank: 'Assistant Professor I', status: 'On Leave' },
];

export default function HRCollegeFaculty() {
  const { currentScreen, showToast } = useApp();
  const college: College = (SCREEN_TO_COLLEGE as any)[currentScreen] ?? 'CCS';
  const data = COLLEGE_DATA[college];
  const [rosterDept, setRosterDept] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {/* College Header */}
      <div className="rounded-2xl border shadow-sm p-6" style={{ borderColor: `${data.color}30`, background: `${data.color}08` }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold" style={{ background: data.color }}>
            {college}
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">{data.fullName}</h2>
            <p className="text-sm text-muted mt-0.5">{data.depts.length} departments · {data.depts.reduce((a, d) => a + d.count, 0)} total faculty</p>
          </div>
        </div>
      </div>

      {/* Departmental Summary Matrix */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-lilac/10 flex items-center justify-between">
          <p className="text-sm font-bold text-primary">Departmental Summary Matrix</p>
          <button onClick={() => showToast({ type: 'success', title: 'Report generated.' })} className="rounded-lg px-4 py-2 text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-colors">Generate Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-blossom/30">
              <tr>
                {['Dept Code', 'Department Name', 'Department Chair', 'Faculty Count', 'S:F Ratio', 'Avg Unit Load', 'Actions'].map(h => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.depts.map(dept => (
                <tr key={dept.code} className="border-t border-lilac/5 hover:bg-blossom/10 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-primary">{dept.code}</td>
                  <td className="py-3 px-4 font-medium text-primary">{dept.name}</td>
                  <td className="py-3 px-4 text-muted">{dept.chair}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-primary text-base">{dept.count}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-primary">{dept.ratio}</td>
                  <td className="py-3 px-4 font-mono text-muted">{dept.avgLoad}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setRosterDept(rosterDept === dept.code ? null : dept.code)}
                      className="rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors"
                      style={{ background: `${data.color}15`, color: data.color }}>
                      {rosterDept === dept.code ? 'Close Roster' : 'View Roster'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inline Roster Panel */}
      {rosterDept && (
        <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-lilac/10 flex items-center justify-between" style={{ background: `${data.color}08` }}>
            <p className="text-sm font-bold text-primary">Faculty Roster — {rosterDept}</p>
            <button onClick={() => setRosterDept(null)} className="rounded-lg px-3 py-1.5 text-xs font-semibold border border-lilac/15 text-muted hover:bg-blossom/20 transition-colors">Close</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-blossom/20">
                <tr>
                  {['Name', 'Employee ID', 'Academic Rank', 'Status'].map(h => (
                    <th key={h} className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROSTER_SAMPLE.map(r => (
                  <tr key={r.empId} className="border-t border-lilac/5 hover:bg-blossom/10 transition-colors">
                    <td className="py-3 px-4 font-medium text-primary">{r.name}</td>
                    <td className="py-3 px-4 font-mono text-muted">{r.empId}</td>
                    <td className="py-3 px-4 text-muted">{r.rank}</td>
                    <td className="py-3 px-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${r.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

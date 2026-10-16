import type { AppUser, FilterState, NotificationItem } from '../types';

// ── Credentials ────────────────────────────────────────────────────
export const TEST_CREDENTIALS = {
  'exec_vpaa':  { password: 'Exec@123',  role: 'executive' as const },
  'exec_ccs':   { password: 'Exec@123',  role: 'dean' as const },
  'doc.atienza': { password: 'DocAtienza@2026', role: 'executive' as const },
  'vpaa.qcu':   { password: 'VPAA@2026', role: 'executive' as const },
  'dean_ccs':   { password: 'Dean@123',  role: 'dean' as const },
  'dean_coa':   { password: 'Dean@123',  role: 'dean' as const },
  'dean_cob':   { password: 'Dean@123',  role: 'dean' as const },
  'dean_coe':   { password: 'Dean@123',  role: 'dean' as const },
  'dean_coed':  { password: 'Dean@123',  role: 'dean' as const },
  'admin_mis':  { password: 'Admin@123', role: 'admin' as const },
  'admin_ruel': { password: 'Admin@123', role: 'admin' as const },
  'registrar.qcu': { password: 'Registrar@2026', role: 'registrar' as const },
  'hrdepartment.qcu': { password: 'HRDept@2026', role: 'hr' as const },
  'spardsdepartment.qcu': { password: 'SPARDS@2026', role: 'spards' as const },
};
export const TEST_OTP = '123456';

// ── Users ───────────────────────────────────────────────────────────
export const MOCK_USERS: AppUser[] = [
  { id: '1', name: 'Dr. Elena Marquez', username: 'exec_vpaa',  email: 'emarquez@qcu.edu.ph',   role: 'executive', title: 'VP Academic Affairs',       initials: 'EM', status: 'ACTIVE',   failedAttempts: 0 },
  { id: '16', name: 'Dr. T Atienza', username: 'doc.atienza', email: 'tatienza@qcu.edu.ph', role: 'executive', title: 'University President', initials: 'TA', status: 'ACTIVE', failedAttempts: 0 },
  { id: '17', name: 'Dr. Elena Bautista', username: 'vpaa.qcu', email: 'ebautista@qcu.edu.ph', role: 'executive', title: 'Vice President for Academic Affairs', initials: 'EB', status: 'ACTIVE', failedAttempts: 0 },
  { id: '2', name: 'Dean Maria Santos',  username: 'exec_ccs',   email: 'msantos@qcu.edu.ph',    role: 'dean', title: 'Dean, College of Computer Studies', initials: 'MS', status: 'ACTIVE', failedAttempts: 0, college: 'CCS' },
  { id: '3', name: 'Prof. Roan Fernandez', username: 'admin_mis', email: 'rfernandez@qcu.edu.ph', role: 'admin',     title: 'MIS Lead Officer',         initials: 'RF', status: 'ACTIVE',   failedAttempts: 0 },
  { id: '4', name: 'Engr. Roel Cruz',    username: 'admin_ruel', email: 'rcruz@qcu.edu.ph',      role: 'admin',     title: 'Registrar Data Officer',   initials: 'RC', status: 'ACTIVE',   failedAttempts: 0 },
  { id: '5', name: 'Dr. Lourdes Decena', username: 'ldecena',   email: 'ldecena@qcu.edu.ph',    role: 'executive', title: 'University President',     initials: 'LD', status: 'ACTIVE',   failedAttempts: 0 },
  { id: '6', name: 'Dean Mark Barra', username: 'mbarra', email: 'mborromeo@qcu.edu.ph',  role: 'dean', title: 'Dean, College of Engineering', initials: 'MB', status: 'FROZEN', failedAttempts: 3, college: 'COE' },
  { id: '7', name: 'Prof. Ana Reyes',    username: 'areyes',    email: 'areyes@qcu.edu.ph',     role: 'executive', title: 'Department Head, BSIT',    initials: 'AR', status: 'ACTIVE',   failedAttempts: 0 },
  { id: '8', name: 'Dr. Carla Torres',   username: 'ctorres',   email: 'ctorres@qcu.edu.ph',    role: 'dean', title: 'Dean, College of Business', initials: 'CT', status: 'DEACTIVATED', failedAttempts: 0, college: 'CBA' },
  { id: '9', name: 'Dean Maria Santos', username: 'dean_ccs', email: 'dean.ccs@qcu.edu.ph', role: 'dean', title: 'Dean, College of Computer Studies', initials: 'MS', status: 'ACTIVE', failedAttempts: 0, college: 'CCS' },
  { id: '10', name: 'Dean Patricia Lim', username: 'dean_coa', email: 'dean.coa@qcu.edu.ph', role: 'dean', title: 'Dean, College of Accountancy', initials: 'PL', status: 'ACTIVE', failedAttempts: 0, college: 'CBA' },
  { id: '11', name: 'Dean Carla Torres', username: 'dean_cob', email: 'dean.cob@qcu.edu.ph', role: 'dean', title: 'Dean, College of Business', initials: 'CT', status: 'ACTIVE', failedAttempts: 0, college: 'CBA' },
  { id: '12', name: 'Dean Mark Barra', username: 'dean_coe', email: 'dean.coe@qcu.edu.ph', role: 'dean', title: 'Dean, College of Engineering', initials: 'MB', status: 'ACTIVE', failedAttempts: 0, college: 'COE' },
  { id: '13', name: 'Dean Liza Ramos', username: 'dean_coed', email: 'dean.coed@qcu.edu.ph', role: 'dean', title: 'Dean, College of Education', initials: 'LR', status: 'ACTIVE', failedAttempts: 0, college: 'COED' },
  { id: '14', name: 'Ms. Rowena Alcantara', username: 'hrdepartment.qcu', email: 'hrdepartment@qcu.edu.ph', role: 'hr', title: 'HR Department Head', initials: 'RA', status: 'ACTIVE', failedAttempts: 0 },
  { id: '15', name: 'Ms. Cristina Dela Cruz', username: 'spardsdepartment.qcu', email: 'spardsdepartment@qcu.edu.ph', role: 'spards', title: 'SPARDS Department Head', initials: 'CD', status: 'ACTIVE', failedAttempts: 0 },
  { id: '18', name: 'Isabel Reyes', username: 'registrar.qcu', email: 'registrar@qcu.edu.ph', role: 'registrar', title: 'University Registrar', initials: 'IR', status: 'ACTIVE', failedAttempts: 0 },
];

// ── Enrollment source metadata ───────────────────────────────────────
// Source: Extracted_QCU_Enrollment_2026-2027(1).xlsx
// Reporting period: 1st Semester, A.Y. 2026–2027
// College groupings are inferred by the source workbook and must be verified.
export const ENROLLMENT_SOURCE = {
  academicYear: '2026–2027',
  semester: '1st Semester',
  programRowsTotal: 12485,
  reportedGrandTotal: 12522,
  discrepancy: 37,
  note: 'Program-row totals are used for consistent program/college totals. The source Grand Total is 37 higher; campus/year-level discrepancies require verification.',
};

export const CAMPUS_CODES = {
  BA: 'Batasan',
  SB: 'San Bartolome',
  SF: 'San Francisco',
} as const;

// Student counts are aggregated from the individual program rows in the workbook.
// Faculty counts are not present in the enrollment workbook; null means unavailable, not zero.
export const COLLEGES = {
  CCS:  { name: 'College of Computer Studies (inferred)', color: '#333333', students: 3422, faculty: null },
  COE:  { name: 'College of Engineering (inferred)', color: '#FF6B00', students: 2743, faculty: null },
  CBA:  { name: 'College of Business and Accountancy (inferred)', color: '#FFC700', students: 5338, faculty: null },
  COED: { name: 'College of Education (inferred)', color: '#0052CC', students: 982, faculty: null },
};

// Canonical college-to-program mapping used by synchronized filters.
export const PROGRAMS: Record<string, string[]> = {
  CCS:  ['BSIT', 'BSIS', 'BSCS'],
  COB:  ['BSE', 'MSENT'],
  COA:  ['BSA', 'BSMA'],
  COE:  ['BSEE', 'BSIE'],
  COED: ['BECED'],
};

export const PROGRAM_HEADCOUNT: Record<string, number> = {
  BECEd: 982,
  BSA: 933,
  BSCpE: 202,
  BSCS: 436,
  BSEE: 50,
  BSECE: 754,
  BSEntrep: 3598,
  BSIE: 1737,
  BSIS: 282,
  BSIT: 2704,
  BSMA: 807,
};

// Enrollment by program and campus, copied from the workbook's program rows.
// Do not use the workbook's year-level breakdown yet: some rows do not reconcile to enrollment totals.
export const PROGRAM_ENROLLMENT = [
  { program: 'BECEd', college: 'COED', enrolled: 982, campuses: { BA: 150, SB: 782, SF: 50 } },
  { program: 'BSA', college: 'CBA', enrolled: 933, campuses: { BA: 0, SB: 933, SF: 0 } },
  { program: 'BSCpE', college: 'COE', enrolled: 202, campuses: { BA: 0, SB: 202, SF: 0 } },
  { program: 'BSCS', college: 'CCS', enrolled: 436, campuses: { BA: 0, SB: 436, SF: 0 } },
  { program: 'BSEE', college: 'COE', enrolled: 50, campuses: { BA: 0, SB: 50, SF: 0 } },
  { program: 'BSECE', college: 'COE', enrolled: 754, campuses: { BA: 0, SB: 754, SF: 0 } },
  { program: 'BSEntrep', college: 'CBA', enrolled: 3598, campuses: { BA: 938, SB: 2121, SF: 539 } },
  { program: 'BSIE', college: 'COE', enrolled: 1737, campuses: { BA: 0, SB: 1737, SF: 0 } },
  { program: 'BSIS', college: 'CCS', enrolled: 282, campuses: { BA: 0, SB: 282, SF: 0 } },
  { program: 'BSIT', college: 'CCS', enrolled: 2704, campuses: { BA: 261, SB: 2249, SF: 194 } },
  { program: 'BSMA', college: 'CBA', enrolled: 807, campuses: { BA: 0, SB: 807, SF: 0 } },
] as const;

// ── Computed / filtered data helpers ─────────────────────────────────
function getCampusCode(campus: string): 'BA' | 'SB' | 'SF' | 'All' {
  if (campus === 'Batasan Campus' || campus === 'Batasan' || campus === 'BA') return 'BA';
  if (campus === 'San Bartolome (Main)' || campus === 'San Bartolome' || campus === 'SB') return 'SB';
  if (campus === 'San Francisco' || campus === 'SF') return 'SF';
  return 'All';
}

function hasUnsupportedStudentFilter(filters: FilterState): boolean {
  const f = filters as FilterState & Record<string, unknown>;
  const unsupportedKeys = ['firstGenStatus', 'ageRange', 'studentType', 'studentStatus', 'scholarship', 'incomeBracket'];
  return unsupportedKeys.some(key => f[key] !== undefined && f[key] !== 'All');
}

function getEnrollmentRows(filters: FilterState) {
  const f = filters as FilterState & Record<string, unknown>;
  if (f.academicYear !== undefined && f.academicYear !== 'All' && f.academicYear !== '2026–2027' && f.academicYear !== '2026-2027') return [];
  if (f.semester !== undefined && f.semester !== 'All' && f.semester !== '1st Semester') return [];
  if (f.yearLevel !== undefined && f.yearLevel !== 'All') return [];
  if (hasUnsupportedStudentFilter(filters)) return [];

  const campusCode = getCampusCode(String(f.campus ?? 'All'));
  return PROGRAM_ENROLLMENT.filter(row =>
    (f.college === undefined || f.college === 'All' || row.college === f.college)
    && (f.program === undefined || f.program === 'All' || row.program === f.program)
  ).map(row => ({
    ...row,
    count: campusCode === 'All' ? row.enrolled : row.campuses[campusCode],
  }));
}

export function getCollegeDonutData(filters: FilterState) {
  if (hasUnsupportedStudentFilter(filters)) return [];
  return Object.entries(COLLEGES)
    .filter(([code]) => filters.college === 'All' || filters.college === code)
    .map(([code, college]) => ({
      name: code,
      fullName: college.name,
      value: getEnrollmentRows({ ...filters, college: code } as FilterState).reduce((sum, row) => sum + row.count, 0),
      color: college.color,
    }));
}

export function getTotalStudents(filters: FilterState): number {
  return getEnrollmentRows(filters).reduce((sum, row) => sum + row.count, 0);
}

// The enrollment workbook does not contain first-generation, gender, age, income,
// scholarship, residency, retention, or year-level data that can be safely reconciled.
// Keep these exports for UI compatibility but return no invented statistics.
export function getFirstGenData(_filters: FilterState) {
  return { firstGen: 0, nonFirstGen: 0, pct: 0 };
}

export function getGenderData(_filters: FilterState) {
  return [] as { college: string; male: number; female: number }[];
}

export function getOverallGenderPct(_filters: FilterState) {
  return { femalePct: 0, malePct: 0 };
}

// Faculty and employee figures are not present in this enrollment workbook.
export function getFacultyData(_filters: FilterState) {
  return { fullTime: 0, partTime: 0 };
}

export function getFacultyRankData(_filters: FilterState) {
  return [] as { rank: string; count: number }[];
}

export function getGeoData(_filters: FilterState) {
  return [] as { district: string; students: number }[];
}

export function getAgeData(_filters: FilterState) {
  return [] as { age: string; single: number; married: number }[];
}

// The source does not provide program capacity, so capacity comparisons are omitted.
export function getCapacityData(_filters: FilterState) {
  return [] as { program: string; enrolled: number; capacity: number; college: string; color: string }[];
}

export function getFacultyDonutData(_filters: FilterState) {
  return [] as { name: string; value: number; color: string }[];
}

export function getFacultyGenderData(_filters: FilterState) {
  return [] as { status: string; count: number }[];
}

export function getQualificationData(_filters: FilterState) {
  return [] as { dept: string; bachelors: number; masters: number; phd: number }[];
}

export function getIncomeData(_filters: FilterState) {
  return [] as { bracket: string; value: number; color: string }[];
}

export function getScholarshipData(_filters: FilterState) {
  return [] as { grant: string; firstGen: number; nonGen: number }[];
}

export function getRetentionData(_filters: FilterState) {
  return [] as { year: string; label: string; students: number; pct: number }[];
}

// ── Notifications ────────────────────────────────────────────────────
export const NOTIFICATIONS: NotificationItem[] = [
  { id: '1', type: 'lock',   message: 'exec_ccs account frozen after 3 failed OTP attempts', time: '10 min ago', read: false },
  { id: '2', type: 'upload', message: 'Enrollees_AY2026 batch committed — 10,000 rows', time: '1 hr ago',  read: false },
  { id: '3', type: 'export', message: 'exec_vpaa exported Executive KPI PDF report', time: '2 hrs ago', read: false },
  { id: '4', type: 'system', message: 'Schema validation flagged 2 errors in AY2026 dataset', time: '3 hrs ago', read: true },
];

// ── Audit Log ────────────────────────────────────────────────────────
export const AUDIT_LOGS = [
  { timestamp: '09/24/2026 10:14:02', actor: 'admin_ruel', action: 'COMMIT_DATA_INGESTION', entity: 'Enrollees_AY2026',     ip: '192.168.1.45' },
  { timestamp: '09/24/2026 09:30:11', actor: 'exec_vpaa',  action: 'EXPORT_PDF_REPORT',    entity: 'Executive KPI Summary', ip: '112.201.42.10' },
  { timestamp: '09/24/2026 08:12:05', actor: 'exec_ccs',   action: 'ACCOUNT_LOCKED_3X',    entity: 'User Account',          ip: '112.201.42.88' },
  { timestamp: '09/24/2026 07:45:00', actor: 'admin_mis',  action: 'USER_PROFILE_EDITED',  entity: 'exec_ccs',              ip: '192.168.1.12' },
  { timestamp: '09/23/2026 16:22:33', actor: 'exec_vpaa',  action: 'LOGIN_SUCCESS',         entity: 'Auth Session',          ip: '112.201.42.10' },
  { timestamp: '09/23/2026 15:10:07', actor: 'admin_ruel', action: 'LOGIN_SUCCESS',         entity: 'Auth Session',          ip: '192.168.1.45' },
  { timestamp: '09/23/2026 14:55:00', actor: 'exec_ccs',   action: 'LOGIN_FAILED',          entity: 'Auth Session',          ip: '112.201.42.88' },
  { timestamp: '09/23/2026 14:54:50', actor: 'exec_ccs',   action: 'LOGIN_FAILED',          entity: 'Auth Session',          ip: '112.201.42.88' },
  { timestamp: '09/23/2026 11:30:00', actor: 'admin_mis',  action: 'EXPORT_EXCEL_REPORT',   entity: 'Student Demographics',  ip: '192.168.1.12' },
  { timestamp: '09/23/2026 09:00:00', actor: 'exec_vpaa',  action: 'DATA_FILTER_APPLIED',   entity: 'Executive Dashboard',   ip: '112.201.42.10' },
];

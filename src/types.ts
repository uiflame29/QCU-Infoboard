export type UserRole = 'admin' | 'executive' | 'dean' | 'registrar' | 'hr' | 'spards';

export type ScreenId =
  | 'login' | 'otp'
  | 'exec-dashboard' | 'registrar-dashboard' | 'registrar-college-data' | 'dean-dashboard' | 'student-analytics' | 'faculty-analytics'
  | 'president-dashboard' | 'president-enrollment' | 'president-college-share'
  | 'president-demographics' | 'president-announcements' | 'president-approvals'
  | 'president-global-curriculum' | 'president-empowered-educators'
  | 'president-student-engagement' | 'president-research-excellence'
  | 'president-community-synergy' | 'president-supportive-infrastructures'
  | 'president-governance-excellence' | 'president-trend-forecasting'
  | 'president-import-data' | 'president-audit-trail' | 'president-export-reports'
  | 'president-system-settings' | 'president-search-filter'
  | 'admission-analytics' | 'report-generation' | 'import-data'
  | 'admin-dashboard' | 'user-management' | 'institutional-data'
  | 'institutional-data-students' | 'institutional-data-employees'
  | 'data-validation' | 'system-configuration' | 'audit-logs'
  | 'global-search'
  | 'hr-dashboard' | 'hr-analytics' | 'hr-import-data' | 'hr-faculty-records'
  | 'hr-analytics-demographics' | 'hr-analytics-rank' | 'hr-analytics-load'
  | 'hr-analytics-employment' | 'hr-analytics-performance' | 'hr-analytics-retention'
  | 'hr-export-reports'
  | 'hr-erecords-vault' | 'hr-college-ccs' | 'hr-college-coa' | 'hr-college-cob'
  | 'hr-college-coe' | 'hr-college-coed' | 'hr-reports' | 'hr-search'
  | 'spards-dashboard' | 'spards-analytics' | 'spards-import-data'
  | 'spards-analytics-active' | 'spards-analytics-distribution'
  | 'spards-analytics-college' | 'spards-analytics-retention'
  | 'spards-analytics-financial' | 'spards-analytics-demographics'
  | 'spards-analytics-performance' | 'spards-financial-assistance'
  | 'spards-scholar-records' | 'spards-grant-programs' | 'spards-erecords'
  | 'spards-college-ccs' | 'spards-college-coa' | 'spards-college-cob'
  | 'spards-college-coe' | 'spards-college-coed'
  | 'spards-reports' | 'spards-export-reports' | 'spards-search'
  | 'dean-student-data' | 'dean-faculty-data' | 'dean-college-data';

export interface AppUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  title: string;
  initials: string;
  status: 'ACTIVE' | 'FROZEN' | 'DEACTIVATED';
  failedAttempts: number;
  college?: 'CCS' | 'COE' | 'COB' | 'COA' | 'COED';
}

export interface FilterState {
  academicYear: string;
  semester: string;
  campus: string;
  college: string;
  program: string;
  yearLevel: string;
  studentStatus: string;
  studentType: string;
  ageRange: string;
  firstGenStatus: string;
  employmentStatus: string;
  scholarship: string;
  incomeBracket?: string;
}

export interface ToastMsg {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  body?: string;
}

export interface ModalConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface NotificationItem {
  id: string;
  type: 'lock' | 'upload' | 'export' | 'system';
  message: string;
  time: string;
  read: boolean;
}

import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import Layout from './components/Layout';
import ExecutiveDashboard from './screens/ExecutiveDashboard';
import StudentAnalytics from './screens/StudentAnalytics';
import FacultyAnalytics from './screens/FacultyAnalytics';
import ExecutiveStudentAnalytics from './screens/ExecutiveStudentAnalytics';
import ExecutiveFacultyAnalytics from './screens/ExecutiveFacultyAnalytics';
import AdmissionAnalytics from './screens/AdmissionAnalytics';
import ReportGeneration from './screens/ReportGeneration';
import AdminDashboard from './screens/admin/AdminDashboard';
import UserManagement from './screens/admin/UserManagement';
import DataValidation from './screens/admin/DataValidation';
import AuditLogs from './screens/admin/AuditLogs';
import InstitutionalData from './screens/admin/InstitutionalData';
import SystemConfiguration from './screens/admin/SystemConfiguration';
import ImportData from './screens/ImportData';
import GlobalSearch from './screens/GlobalSearch';
import DeanDashboard from './screens/DeanDashboard';
import DeanStudentData from './screens/DeanStudentData';
import DeanFacultyData from './screens/DeanFacultyData';
import DeanCollegeData from './screens/DeanCollegeData';
import HRDashboard from './screens/hr/HRDashboard';
import HRAnalytics from './screens/hr/HRAnalytics';
import HRImportData from './screens/hr/HRImportData';
import HRFacultyRecords from './screens/hr/HRFacultyRecords';
import HRFacultyERecords from './screens/hr/HRFacultyERecords';
import HRCollegeFaculty from './screens/hr/HRCollegeFaculty';
import HRReports from './screens/hr/HRReports';
import HRSearch from './screens/hr/HRSearch';
import SPARDSDashboard from './screens/spards/SPARDSDashboard';
import SPARDSAnalytics from './screens/spards/SPARDSAnalytics';
import SPARDSImportData from './screens/spards/SPARDSImportData';
import SPARDSScholarRecords from './screens/spards/SPARDSScholarRecords';
import SPARDSGrantPrograms from './screens/spards/SPARDSGrantPrograms';
import SPARDSCollegeScholars from './screens/spards/SPARDSCollegeScholars';
import SPARDSERecords from './screens/spards/SPARDSERecords';
import SPARDSReports from './screens/spards/SPARDSReports';
import SPARDSSearch from './screens/spards/SPARDSSearch';
import RegistrarDashboard from './screens/RegistrarDashboard';
import RegistrarCollegeData from './screens/RegistrarCollegeData';
import PresidentDashboard from './screens/president/PresidentDashboard';
import PresidentAnalytics from './screens/president/PresidentAnalytics';
import PresidentAffairs from './screens/president/PresidentAffairs';
import PresidentPlaceholder from './screens/president/PresidentPlaceholder';
import PresidentExportReports from './screens/president/PresidentExportReports';
import PresidentGlobalCurriculum from './screens/president/PresidentGlobalCurriculum';
import PresidentEmpoweredEducators from './screens/president/PresidentEmpoweredEducators';
import PresidentStudentEngagement from './screens/president/PresidentStudentEngagement';
import PresidentForecastingCenter from './screens/president/PresidentForecastingCenter';
import PresidentResearchExcellence from './screens/president/PresidentResearchExcellence';
import PresidentCommunitySynergy from './screens/president/PresidentCommunitySynergy';
import PresidentSupportiveInfrastructures from './screens/president/PresidentSupportiveInfrastructures';
import PresidentGovernanceExcellence from './screens/president/PresidentGovernanceExcellence';
import PresidentDataSubmissions from './screens/president/PresidentDataSubmissions';
import PresidentSearchPortal from './screens/president/PresidentSearchPortal';

function AppRouter() {
  const { currentUser, currentScreen } = useApp();

  if (!currentUser || currentScreen === 'login' || currentScreen === 'otp') {
    return <Login />;
  }

  const screens: Record<string, React.ReactNode> = {
    'president-dashboard': <PresidentDashboard />,
    'president-enrollment': <PresidentAnalytics view="enrollment" />,
    'president-college-share': <PresidentAnalytics view="share" />,
    'president-demographics': <PresidentAnalytics view="demographics" />,
    'president-announcements': <PresidentAffairs view="announcements" />,
    'president-approvals': <PresidentAffairs view="approvals" />,
    'president-global-curriculum': <PresidentGlobalCurriculum />,
    'president-empowered-educators': <PresidentEmpoweredEducators />,
    'president-student-engagement': <PresidentStudentEngagement />,
    'president-research-excellence': <PresidentResearchExcellence />,
    'president-community-synergy': <PresidentCommunitySynergy />,
    'president-supportive-infrastructures': <PresidentSupportiveInfrastructures />,
    'president-governance-excellence': <PresidentGovernanceExcellence />,
    'president-trend-forecasting': <PresidentForecastingCenter />,
    'president-import-data': <PresidentDataSubmissions initialView="import" />,
    'president-audit-trail': <PresidentDataSubmissions initialView="trail" />,
    'president-export-reports': <PresidentExportReports />,
    'president-system-settings': <PresidentPlaceholder />,
    'president-search-filter': <PresidentSearchPortal />,
    'exec-dashboard':     <ExecutiveDashboard />,
    'registrar-dashboard': <RegistrarDashboard />,
    'registrar-college-data': <RegistrarCollegeData />,
    'dean-dashboard':     <DeanDashboard />,
    'dean-student-data':  <DeanStudentData />,
    'dean-faculty-data':  <DeanFacultyData />,
    'dean-college-data':  <DeanCollegeData />,
    'student-analytics':  currentUser.role === 'executive' ? <ExecutiveStudentAnalytics /> : <StudentAnalytics />,
    'faculty-analytics':  currentUser.role === 'executive' ? <ExecutiveFacultyAnalytics /> : <FacultyAnalytics />,
    'admission-analytics':<AdmissionAnalytics />,
    'report-generation':  <ReportGeneration />,
    'import-data':         <ImportData />,
    'admin-dashboard':    <AdminDashboard />,
    'user-management':    <UserManagement />,
    'institutional-data': <InstitutionalData />,
    'institutional-data-students': <InstitutionalData initialTab="Students" />,
    'institutional-data-employees': <InstitutionalData initialTab="Employee" />,
    'data-validation':    <DataValidation />,
    'system-configuration': <SystemConfiguration />,
    'audit-logs':         <AuditLogs />,
    'global-search':      <GlobalSearch />,
    'hr-dashboard':       <HRDashboard />,
    'hr-analytics':       <HRAnalytics />,
    'hr-analytics-demographics': <HRAnalytics initialTab="Demographics" />,
    'hr-analytics-rank': <HRAnalytics initialTab="Academic Rank" />,
    'hr-analytics-load': <HRAnalytics initialTab="Teaching Load" />,
    'hr-analytics-employment': <HRAnalytics initialTab="Employment Status" />,
    'hr-analytics-performance': <HRAnalytics initialTab="Performance" />,
    'hr-analytics-retention': <HRAnalytics initialTab="Retention" />,
    'hr-import-data':     <HRImportData />,
    'hr-faculty-records': <HRFacultyRecords />,
    'hr-erecords-vault':  <HRFacultyERecords />,
    'hr-college-ccs':     <HRCollegeFaculty />,
    'hr-college-coa':     <HRCollegeFaculty />,
    'hr-college-cob':     <HRCollegeFaculty />,
    'hr-college-coe':     <HRCollegeFaculty />,
    'hr-college-coed':    <HRCollegeFaculty />,
    'hr-reports':         <HRReports />,
    'hr-export-reports':  <HRReports />,
    'hr-search':          <HRSearch />,
    'spards-dashboard':      <SPARDSDashboard />,
    'spards-analytics':      <SPARDSAnalytics />,
    'spards-analytics-active': <SPARDSAnalytics initialView="overview" />,
    'spards-analytics-distribution': <SPARDSAnalytics initialView="grant" />,
    'spards-analytics-college': <SPARDSAnalytics initialView="firstgen" />,
    'spards-analytics-retention': <SPARDSAnalytics initialView="retention" />,
    'spards-analytics-financial': <SPARDSAnalytics initialView="disbursement" />,
    'spards-analytics-demographics': <SPARDSAnalytics initialView="socioeconomic" />,
    'spards-analytics-performance': <SPARDSAnalytics initialView="gpa" />,
    'spards-import-data':    <SPARDSImportData />,
    'spards-financial-assistance': <SPARDSImportData />,
    'spards-scholar-records':<SPARDSScholarRecords />,
    'spards-grant-programs': <SPARDSGrantPrograms />,
    'spards-erecords':       <SPARDSERecords />,
    'spards-college-ccs':    <SPARDSCollegeScholars college="CCS" />,
    'spards-college-coa':    <SPARDSCollegeScholars college="COA" />,
    'spards-college-cob':    <SPARDSCollegeScholars college="COB" />,
    'spards-college-coe':    <SPARDSCollegeScholars college="COE" />,
    'spards-college-coed':   <SPARDSCollegeScholars college="COED" />,
    'spards-reports':        <SPARDSReports />,
    'spards-export-reports': <SPARDSReports exportMode />,
    'spards-search':         <SPARDSSearch />,
  };

  return (
    <Layout>
      {screens[currentScreen] ?? (currentUser.username === 'doc.atienza' ? <PresidentDashboard /> : currentUser.role === 'registrar' ? <RegistrarDashboard /> : currentUser.role === 'hr' ? <HRDashboard /> : currentUser.role === 'spards' ? <SPARDSDashboard /> : <ExecutiveDashboard />)}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useApp } from '../context/AppContext';
import type { ScreenId } from '../types';
import FilterBar from './FilterBar';
import Toast from './Toast';
import Modal from './Modal';

type NavChild = { id: ScreenId; label: string; context?: string };
type NavItem = { id?: ScreenId; label: string; icon: ReactNode; children?: NavChild[] };
type NavGroup = { label: string; items: NavItem[] };

const icons = {
  dashboard: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="8" rx="2" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="3" width="7" height="5" rx="2" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="12" width="7" height="9" rx="2" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="15" width="7" height="6" rx="2" stroke="currentColor" strokeWidth="1.6"/></svg>,
  analytics: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  people: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M2 21c0-4 3-7 7-7s7 3 7 7m1-10a3.5 3.5 0 010-7m1 10c2.7.5 4 2.4 4 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  star: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 6 7 .9-5 4.8 1.2 6.8L12 17.4l-6.2 3.1L7 13.7 2 8.9 9 8l3-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  file: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.6"/><path d="M14 2v6h6M8 13h8M8 17h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  upload: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 16V3m0 0L7 8m5-5l5 5M4 15v5h16v-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  building: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 12h2m2 0h2m-6 4h2m2 0h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  validation: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.6"/><path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  settings: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M19 12a7 7 0 00-.1-1l2-1.6-2-3.5-2.5 1a8 8 0 00-1.7-1L14.3 3h-4.1L9.8 5.8a8 8 0 00-1.7 1l-2.5-1-2 3.5 2 1.6a7 7 0 000 2L3.6 14.5l2 3.5 2.5-1a8 8 0 001.7 1l.4 2.8h4.1l.4-2.8a8 8 0 001.7-1l2.5 1 2-3.5-2-1.6a7 7 0 00.1-1z" stroke="currentColor" strokeWidth="1.2"/></svg>,
  search: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
};

const EXEC_GROUPS: NavGroup[] = [
  { label: 'Dashboards', items: [
    { id: 'exec-dashboard', label: 'Executive Dashboard Overview', icon: icons.dashboard },
  ]},
  { label: 'Analytics Suite', items: [
    { id: 'student-analytics', label: 'Enrollment Analytics', icon: icons.people },
    { id: 'faculty-analytics', label: 'Faculty Analytics', icon: icons.analytics },
    { id: 'admission-analytics', label: 'Admission / First-Gen Analytics', icon: icons.star },
  ]},
  { label: 'Data & Utilities', items: [
    { id: 'global-search', label: 'Search & Filter Portal', icon: icons.search },
    { id: 'president-export-reports', label: 'Export Reports & Certified Briefings', icon: icons.file },
  ]},
];

const PRESIDENT_GROUPS: NavGroup[] = [
  { label: 'Dashboard', items: [
    { id: 'president-dashboard', label: 'Executive Command Center', icon: icons.dashboard },
  ]},
  { label: 'Strategic Directions', items: [
    { label: 'Seven Strategic Pillars', icon: icons.analytics, children: [
      { id: 'president-global-curriculum', label: '1. Global Standard Curriculum' },
      { id: 'president-empowered-educators', label: '2. Empowered Educators' },
      { id: 'president-student-engagement', label: '3. Dynamic Student Engagement' },
      { id: 'president-research-excellence', label: '4. Research Excellence' },
      { id: 'president-community-synergy', label: '5. Community Synergy' },
      { id: 'president-supportive-infrastructures', label: '6. Supportive Infrastructures' },
      { id: 'president-governance-excellence', label: '7. Governance for Excellence' },
    ]},
  ]},
  { label: 'Trend Analysis', items: [
    { id: 'president-trend-forecasting', label: 'Forecasting Center', icon: icons.analytics },
  ]},
  { label: 'Data Governance', items: [
    { label: 'Data Owner Submissions', icon: icons.upload, children: [
      { id: 'president-import-data', label: 'Import Data' },
      { id: 'president-audit-trail', label: 'Audit Logs' },
    ]},
  ]},
  { label: 'Search & Discovery', items: [
    { id: 'president-search-filter', label: 'Search Portal', icon: icons.search },
  ]},
  { label: 'Reports', items: [
    { id: 'president-export-reports', label: 'Export Reports', icon: icons.file },
  ]},
];

const REGISTRAR_GROUPS: NavGroup[] = [
  { label: 'College Intelligence', items: [
    { id: 'registrar-dashboard', label: 'Dashboard Overview', icon: icons.dashboard },
    {
      label: 'Analytics', icon: icons.analytics,
      children: [
        { id: 'student-analytics', label: 'Enrollment Analytics' },
        { id: 'faculty-analytics', label: 'Faculty Analytics' },
        { id: 'admission-analytics', label: 'Admission Analytics' },
      ],
    },
    {
      label: 'Data Management', icon: icons.upload,
      children: [{ id: 'import-data', label: 'Import Data' }],
    },
    { id: 'registrar-college-data', label: 'College Data', icon: icons.building },
    { id: 'report-generation', label: 'Reports', icon: icons.file },
  ]},
  { label: 'Discovery', items: [{ id: 'global-search', label: 'Search & Filter', icon: icons.search }] },
];

const DEAN_GROUPS: NavGroup[] = [
  { label: 'College Intelligence', items: [
    { id: 'dean-dashboard', label: 'Dashboard Overview', icon: icons.dashboard },
    {
      label: 'Analytics', icon: icons.analytics,
      children: [
        { id: 'student-analytics', label: 'Student Analytics' },
        { id: 'faculty-analytics', label: 'Faculty Analytics' },
      ],
    },
    {
      label: 'Data Management', icon: icons.upload,
      children: [
        { id: 'dean-student-data', label: 'Student Data Management' },
        { id: 'dean-faculty-data', label: 'Faculty Data Management' },
      ],
    },
    { id: 'dean-college-data', label: 'College Data', icon: icons.building },
    { id: 'report-generation', label: 'Reports', icon: icons.file },
  ]},
  { label: 'Discovery', items: [{ id: 'global-search', label: 'Search & Filter', icon: icons.search }] },
];

const HR_GROUPS: NavGroup[] = [
  { label: 'College Intelligence', items: [
    { id: 'hr-dashboard', label: 'Dashboard Overview', icon: icons.dashboard },
    {
      label: 'Analytics', icon: icons.analytics,
      children: [
        { id: 'hr-analytics', label: 'Faculty Overview' },
        { id: 'hr-analytics-demographics', label: 'Faculty Demographics' },
        { id: 'hr-analytics-rank', label: 'Academic Rank Analytics' },
        { id: 'hr-analytics-load', label: 'Teaching Load Analytics' },
        { id: 'hr-analytics-employment', label: 'Employment Status Analytics' },
        { id: 'hr-analytics-performance', label: 'Performance Analytics' },
        { id: 'hr-analytics-retention', label: 'Faculty Retention Analytics' },
      ],
    },
    {
      label: 'Data Management', icon: icons.upload,
      children: [
        { id: 'hr-import-data', label: 'Import Data' },
        { id: 'hr-faculty-records', label: 'Faculty Records' },
      ],
    },
    {
      label: 'College Data', icon: icons.building,
      children: [
        { id: 'hr-college-ccs', label: 'CCS Faculty' },
        { id: 'hr-college-coa', label: 'COA Faculty' },
        { id: 'hr-college-cob', label: 'COB Faculty' },
        { id: 'hr-college-coe', label: 'COE Faculty' },
        { id: 'hr-college-coed', label: 'COED Faculty' },
      ],
    },
    {
      label: 'Reports', icon: icons.file,
      children: [
        { id: 'hr-reports', label: 'Faculty Reports' },
      ],
    },
  ]},
  { label: 'Discovery', items: [{ id: 'hr-search', label: 'Search & Filter', icon: icons.search }] },
];

const SPARDS_GROUPS: NavGroup[] = [
  { label: 'College Intelligence', items: [
    { id: 'spards-dashboard', label: 'Dashboard Overview', icon: icons.dashboard },
    {
      label: 'Analytics', icon: icons.analytics,
      children: [
        { id: 'spards-analytics', label: 'Scholarship Overview' },
        { id: 'spards-analytics-demographics', label: 'Scholarship Demographics' },
        { id: 'spards-analytics-distribution', label: 'Scholarship Distribution' },
        { id: 'spards-analytics-performance', label: 'Beneficiary Performance' },
        { id: 'spards-analytics-retention', label: 'Scholarship Retention' },
        { id: 'spards-analytics-college', label: 'First-Gen Scholars' },
        { id: 'spards-analytics-financial', label: 'Financial Assistance Trends' },
      ],
    },
    {
      label: 'Data Management', icon: icons.upload,
      children: [
        { id: 'spards-financial-assistance', label: 'Import Data' },
        { id: 'spards-scholar-records', label: 'Scholarship Records' },
        { id: 'spards-grant-programs', label: 'Scholarship Programs' },
      ],
    },
    {
      label: 'College Data', icon: icons.building,
      children: [
        { id: 'spards-college-ccs', label: 'CCS Scholars' },
        { id: 'spards-college-coa', label: 'COA Scholars' },
        { id: 'spards-college-cob', label: 'COB Scholars' },
        { id: 'spards-college-coe', label: 'COE Scholars' },
        { id: 'spards-college-coed', label: 'COED Scholars' },
      ],
    },
    {
      label: 'Reports', icon: icons.file,
      children: [
        { id: 'spards-reports', label: 'Scholarship Reports' },
      ],
    },
  ]},
  { label: 'Discovery', items: [{ id: 'spards-search', label: 'Search & Filter', icon: icons.search }] },
];

const ADMIN_GROUPS: NavGroup[] = [
  { label: 'Administration Modules', items: [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: icons.dashboard },
    { id: 'user-management', label: 'User Management', icon: icons.people },
  ]},
  { label: 'Data Management', items: [
    { id: 'institutional-data', label: 'Institutional Data', icon: icons.building },
    { id: 'data-validation', label: 'Data Validation', icon: icons.validation },
  ]},
  { label: 'Discovery', items: [{ id: 'global-search', label: 'Search & Filter', icon: icons.search }] },
  { label: 'Executive Reporting', items: [
    { id: 'president-export-reports', label: 'Export Reports', icon: icons.file },
  ]},
  { label: 'System', items: [
    { id: 'system-configuration', label: 'System Configuration', icon: icons.settings },
    { id: 'audit-logs', label: 'Activity Logs', icon: icons.file },
  ]},
];

const LABELS: Partial<Record<ScreenId, [string, string]>> = {
  'president-dashboard': ['Executive Command Center', 'University-wide institutional health, strategic performance, forecasting, and risk intelligence'],
  'president-enrollment': ['Enrollment Trends', 'Historical growth and institutional target projections'],
  'president-college-share': ['College & Program Share', 'Proportional enrollment and academic portfolio distribution'],
  'president-demographics': ['Student Demographics', 'First-generation access and socioeconomic participation'],
  'president-announcements': ['Announcements & Directives', 'University-wide communication reach and acknowledgment monitoring'],
  'president-approvals': ['Approvals Queue', 'Policy changes and fiscal sign-offs awaiting executive action'],
  'president-global-curriculum': ['Global Standard Curriculum', 'Monitor accreditation, COPC issuance, licensure outcomes, and graduate employability'],
  'president-empowered-educators': ['Empowered Educators', 'Monitor faculty distribution, demographic profiles, and academic qualifications for institutional planning and accreditation compliance'],
  'president-student-engagement': ['Dynamic Student Engagement', 'Explore student engagement, participation, and student-centered institutional outcomes.'],
  'president-research-excellence': ['Research Excellence', 'Monitor publication productivity, research funding, intellectual property activity, and SDG-aligned projects.'],
  'president-community-synergy': ['Community Synergy', 'Explore university-community partnerships, outreach initiatives, and community engagement outcomes.'],
  'president-supportive-infrastructures': ['Supportive Infrastructures', 'Review institutional infrastructure, facilities, and resource capacity supporting university operations.'],
  'president-governance-excellence': ['Governance for Excellence', 'Institutional governance, compliance, scholarship processing, and audit resolution'],
  'president-trend-forecasting': ['Trend Analysis & Forecasting', 'Explore institutional trends and projected university trajectories, including the 2028 versus 2031 outlook.'],
  'president-import-data': ['Data Owner Submissions', 'Secure departmental upload, automated schema verification, and governed institutional data ingestion.'],
  'president-audit-trail': ['Data Owner Submissions', 'Immutable submission history, active dataset versions, and verified data-owner accountability.'],
  'president-export-reports': ['Export Reports', 'Access the future workflow for preparing and exporting institutional reports for authorized use.'],
  'president-system-settings': ['System Settings & User Access Control', 'Manage the future configuration of system settings, account permissions, and role-based access.'],
  'president-search-filter': ['Search Portal', 'Universal discovery across authorized institutional records, faculty profiles, research outputs, assets, and audit trails.'],
  'exec-dashboard': ['Executive Dashboard Overview', 'University-wide institutional and academic health at a glance'],
  'registrar-dashboard': ['Registrar Dashboard', 'Live enrollment, faculty, admission, retention, and capacity intelligence'],
  'registrar-college-data': ['College Data', 'University-wide college and official academic program directory'],
  'dean-dashboard': ['College dean overview', 'Program performance, capacity, and academic workforce intelligence'],
  'student-analytics': ['Enrollment Analytics', 'Student demographics, enrollment trends, and capacity intelligence'],
  'faculty-analytics': ['Faculty Analytics', 'Workforce profile, qualifications, and academic capacity'],
  'admission-analytics': ['Admission / First-Gen Analytics', 'First-generation cohort milestones, retention, and scholarship distribution'],
  'report-generation': ['Export Reports & Certified Briefings', 'Generate board-ready institutional documentation'],
  'import-data': ['Import data', 'Submit source records for administrative validation'],
  'admin-dashboard': ['Admin control center', 'System health, governance, and pending work'],
  'user-management': ['Manage user accounts', 'Account lifecycle, permissions, and security'],
  'institutional-data': ['Institutional data', 'Govern university masterlists and academic structures'],
  'institutional-data-students': ['Student Management', 'Manage institutional student records and enrollment profiles'],
  'institutional-data-employees': ['Employee Management', 'Manage institutional employee records and assignments'],
  'data-validation': ['Data validation', 'Review, resolve, and ingest department submissions'],
  'system-configuration': ['System configuration', 'Control platform rules, services, and settings'],
  'audit-logs': ['Activity audit logs', 'Immutable security and governance event trail'],
  'global-search': ['Search & Filter Portal', 'Instant lookup across student records, faculty profiles, and institutional reports'],
  'hr-dashboard': ['HR Dashboard Overview', 'University workforce at a glance'],
  'hr-analytics': ['Faculty Analytics Suite', 'Deep-dive into faculty workforce data'],
  'hr-analytics-demographics': ['Faculty Demographics', 'Faculty composition and demographic trends'],
  'hr-analytics-rank': ['Academic Rank Analytics', 'Academic rank distribution across the university'],
  'hr-analytics-load': ['Teaching Load Analytics', 'Teaching assignments and workload distribution'],
  'hr-analytics-employment': ['Employment Status Analytics', 'Faculty appointment and employment status'],
  'hr-analytics-performance': ['Performance Analytics', 'Faculty performance indicators and trends'],
  'hr-analytics-retention': ['Faculty Retention Analytics', 'Workforce retention and tenure trends'],
  'hr-export-reports': ['Export Reports', 'Download faculty reports and workforce data'],
  'hr-import-data': ['Import HR Data', 'Submit faculty and employee records for validation'],
  'hr-faculty-records': ['Faculty Records', 'Manage and maintain faculty personnel files'],
  'hr-erecords-vault': ['Faculty E-Records Vault', 'Verified digital document repository'],
  'hr-college-ccs': ['CCS Faculty', 'College of Computer Studies faculty roster'],
  'hr-college-coa': ['COA Faculty', 'College of Accountancy faculty roster'],
  'hr-college-cob': ['COB Faculty', 'College of Business faculty roster'],
  'hr-college-coe': ['COE Faculty', 'College of Engineering faculty roster'],
  'hr-college-coed': ['COED Faculty', 'College of Education faculty roster'],
  'hr-reports': ['Faculty Reports & Export', 'Generate and download faculty reports'],
  'hr-search': ['Search & Filter Portal', 'Find faculty records across the institution'],
  'spards-dashboard': ['SPARDS Dashboard Overview', 'Scholarship and financial assistance command center'],
  'spards-analytics': ['Scholarship Overview', 'University-wide scholarship coverage, funding sources, and beneficiary reach'],
  'spards-analytics-active': ['Active Scholars', 'Current scholarship beneficiaries and coverage'],
  'spards-analytics-distribution': ['Scholarship Distribution', 'Scholarship allocation across grants and colleges'],
  'spards-analytics-college': ['First-Gen Scholars', 'Scholarship access and outcomes for first-generation beneficiaries'],
  'spards-analytics-retention': ['Scholarship Retention', 'Beneficiary retention trends across year levels'],
  'spards-analytics-financial': ['Financial Assistance Trends', 'Financial assistance release and utilization trends'],
  'spards-analytics-demographics': ['Scholarship Demographics', 'Socioeconomic and demographic beneficiary profile'],
  'spards-analytics-performance': ['Beneficiary Performance', 'Academic standing of scholarship beneficiaries'],
  'spards-financial-assistance': ['Import Financial Assistance Data', 'Import and validate financial assistance records'],
  'spards-import-data': ['Import Data — Validation Request', 'Submit scholar masterlists for admin validation'],
  'spards-scholar-records': ['Scholar Records Management', 'Manage active and archived scholar profiles'],
  'spards-grant-programs': ['Grant Program Management', 'Oversee scholarship grant configurations'],
  'spards-erecords': ['Scholar E-Records Vault', 'Digitized compliance files and document repository'],
  'spards-college-ccs': ['CCS Scholar Roster', 'College of Computer Studies scholarship coverage'],
  'spards-college-coa': ['COA Scholar Roster', 'College of Accountancy scholarship coverage'],
  'spards-college-cob': ['COB Scholar Roster', 'College of Business scholarship coverage'],
  'spards-college-coe': ['COE Scholar Roster', 'College of Engineering scholarship coverage'],
  'spards-college-coed': ['COED Scholar Roster', 'College of Education scholarship coverage'],
  'spards-reports': ['Scholarship Reports', 'Generate certified financial assistance compliance reports'],
  'spards-export-reports': ['Export Reports', 'Download and export scholarship data workbooks'],
  'spards-search': ['Search & Filter Portal', 'Find scholars and grant data across the institution'],
  'dean-student-data': ['Student Data Management', 'Manage student profiles and enrollment statuses for your college'],
  'dean-faculty-data': ['Faculty Data Management', 'Manage teaching loads and faculty records for your college'],
  'dean-college-data': ['College Data', 'Central repository for departmental master records'],
};

const FILTER_SCREENS: ScreenId[] = [
  'president-dashboard', 'president-enrollment', 'president-college-share', 'president-demographics',
  'exec-dashboard', 'registrar-dashboard', 'dean-dashboard', 'student-analytics', 'faculty-analytics',
  'admission-analytics', 'spards-dashboard', 'hr-analytics',
  'hr-analytics-demographics', 'hr-analytics-rank', 'hr-analytics-load',
  'hr-analytics-employment', 'hr-analytics-performance', 'hr-analytics-retention',
];

const PRESIDENT_BREADCRUMBS: Partial<Record<ScreenId, string[]>> = {
  'president-dashboard': ['Executive Command Center'],
  'president-global-curriculum': ['Strategic Directions', 'Global Standard Curriculum'],
  'president-empowered-educators': ['Strategic Directions', 'Empowered Educators'],
  'president-student-engagement': ['Strategic Directions', 'Pillar 3', 'Dynamic Student Engagement'],
  'president-research-excellence': ['Dashboards', 'Pillar 4', 'Research Excellence'],
  'president-community-synergy': ['Strategic Directions', 'Community Synergy'],
  'president-supportive-infrastructures': ['Strategic Directions', 'Pillar 6', 'Supportive Infrastructures'],
  'president-governance-excellence': ['Strategic Directions', 'Pillar 7', 'Governance for Excellence'],
  'president-trend-forecasting': ['Trend Analysis', 'Forecasting Center'],
  'president-import-data': ['Data Governance', 'Data Owner Submissions', 'Import Data'],
  'president-audit-trail': ['Data Governance', 'Data Owner Submissions', 'Audit Logs'],
  'president-export-reports': ['Reports', 'Export Reports'],
  'president-system-settings': ['System Settings & User Access Control'],
  'president-search-filter': ['Search & Discovery', 'Search Portal'],
};

export default function Layout({ children }: { children: ReactNode }) {
  const { currentUser, currentScreen, navigate, sidebarOpen, setSidebarOpen, notifications, markAllRead, notifOpen, setNotifOpen, showModal, showToast } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [now, setNow] = useState(new Date());
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['Seven Strategic Pillars', 'Data Owner Submissions']));
  const notifRef = useRef<HTMLDivElement>(null);

  function toggleExpanded(label: string) {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }
  const groups = currentUser?.username === 'doc.atienza' ? PRESIDENT_GROUPS : currentUser?.role === 'admin' ? ADMIN_GROUPS : currentUser?.role === 'registrar' ? REGISTRAR_GROUPS : currentUser?.role === 'dean' ? DEAN_GROUPS : currentUser?.role === 'hr' ? HR_GROUPS : currentUser?.role === 'spards' ? SPARDS_GROUPS : EXEC_GROUPS;
  const roleLabel = currentUser?.role === 'admin' ? 'System Administrator' : currentUser?.role === 'registrar' ? 'University Registrar' : currentUser?.role === 'dean' ? 'College Dean' : currentUser?.role === 'hr' ? 'HR Department Head' : currentUser?.role === 'spards' ? 'SPARDS Department Head' : (currentUser?.title ?? 'University Executive');
  const page = LABELS[currentScreen] ?? ['QCU InfoBoard', 'Institutional intelligence platform'];
  const breadcrumbs = currentUser?.username === 'doc.atienza'
    ? PRESIDENT_BREADCRUMBS[currentScreen] ?? [page[0]]
    : [page[0]];
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const updateScrollButton = () => setShowScrollTop(window.scrollY > 420);
    updateScrollButton();
    window.addEventListener('scroll', updateScrollButton, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollButton);
  }, []);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [setNotifOpen]);
  useEffect(() => {
    const activeParent = groups
      .flatMap(group => group.items)
      .find(item => item.children?.some(child => child.id === currentScreen));
    if (activeParent) {
      setExpandedItems(previous => {
        if (previous.has(activeParent.label)) return previous;
        return new Set(previous).add(activeParent.label);
      });
    }
  }, [currentScreen, groups]);

  const clock = useMemo(() => {
    const date = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${date} | ${time}`;
  }, [now]);

  if (!currentUser) return null;
  function logout() {
    showModal({ title: 'Sign Out', message: 'End your secure QCU InfoBoard session?', confirmLabel: 'Sign Out', onConfirm: () => { navigate('login'); showToast({ type: 'success', title: 'Signed out securely' }); } });
  }

  const sidebar = (
    <div className="h-full flex flex-col bg-primary text-white">
      <div className={`h-[4.25rem] flex items-center ${collapsed ? 'justify-center px-2' : 'px-3.5 gap-3'} border-b border-white/10`}>
        <div className="w-10 h-10 rounded-2xl bg-lilac/10 flex items-center justify-center text-lilac shrink-0 border border-lilac/5">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><path d="M12 3L3 8l9 5 9-5-9-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M5.5 11.5V16L12 20l6.5-4v-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        {!collapsed && <div className="min-w-0"><p className="text-base font-bold tracking-tight leading-tight">QCU InfoBoard</p><p className="mt-1 text-[10px] font-medium tracking-[.14em] uppercase text-lilac">{roleLabel}</p></div>}
        {!collapsed && <button onClick={() => { if (window.innerWidth >= 1024) setCollapsed(true); else setSidebarOpen(false); }} className="ml-auto rounded-lg p-2 text-white/45 hover:text-white hover:bg-white/5" aria-label="Close navigation">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>}
      </div>

      {!collapsed && (
        <div className="mx-3.5 mt-5 rounded-3xl border border-lilac/20 bg-lilac/10 px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-lilac text-primary flex items-center justify-center text-sm font-bold shrink-0">
              {currentUser.initials}
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-white truncate">{currentUser.name}</p>
              <p className="mt-0.5 text-xs text-white/45 truncate">{currentUser.title}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex rounded-full border border-lilac/35 bg-lilac/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-lilac">
              {roleLabel}
            </span>
            <p className="mt-3 text-[11px] text-white/30 truncate">{currentUser.email}</p>
          </div>
        </div>
      )}

      <nav className={`flex-1 overflow-y-auto ${collapsed ? 'px-2 py-4' : 'px-2 py-5'}`}>
        {groups.map(group => <div key={group.label} className="mb-5">
          {!collapsed && <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[.15em] text-white/25">{group.label}</p>}
          <div className="space-y-0.5">{group.items.map(item => {
            if (item.children) {
              const isOpen = !collapsed && expandedItems.has(item.label);
              const childActive = item.children.some(c => c.id === currentScreen);
              return (
                <div key={item.label}>
                  <button
                    title={collapsed ? item.label : undefined}
                    onClick={() => collapsed ? setCollapsed(false) : toggleExpanded(item.label)}
                    className={`w-full flex items-center rounded-xl text-sm font-medium ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5'} ${childActive ? 'text-lilac bg-lilac/10' : 'text-white/55 hover:bg-white/5 hover:text-white/85'}`}>
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && <>
                      <span className="min-w-0 flex-1 text-left leading-snug">{item.label}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>}
                  </button>
                  {isOpen && (
                    <div className="mt-0.5 ml-4 pl-3 border-l border-white/10 space-y-0.5">
                      {item.children.map(child => {
                        const active = child.id === currentScreen;
                        return (
                          <button key={child.id} onClick={() => navigate(child.id)}
                            className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${active ? 'bg-lilac/20 text-lilac' : 'text-white/45 hover:bg-white/5 hover:text-white/80'}`}>
                            <span className="w-1 h-1 rounded-full bg-current shrink-0 opacity-60" />
                            <span className="min-w-0 flex-1 text-left leading-snug">
                              <span className="block">{child.label}</span>
                              {child.context && <span className="mt-0.5 block text-[10px] font-normal text-white/30">{child.context}</span>}
                            </span>
                            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-lilac shadow-[0_0_8px_rgba(66,107,194,0.85)]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            const active = item.id === currentScreen;
            return <button key={item.id} title={collapsed ? item.label : undefined} onClick={() => item.id && navigate(item.id)}
              className={`w-full flex items-center rounded-xl text-sm font-medium ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5'} ${active ? 'bg-lilac/20 text-lilac shadow-[inset_0_0_0_1px_rgba(66,107,194,0.10)]' : 'text-white/55 hover:bg-white/5 hover:text-white/85'}`}>
              <span className="shrink-0">{item.icon}</span>{!collapsed && <span className="min-w-0 flex-1 text-left leading-snug">{item.label}</span>}{active && !collapsed && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-lilac shadow-[0_0_8px_rgba(66,107,194,0.85)]" />}
            </button>;
          })}</div>
        </div>)}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button onClick={logout} title={collapsed ? 'Sign Out' : undefined} className={`w-full flex items-center rounded-xl text-white/50 hover:text-blossom hover:bg-obsidian/30 ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'}`}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface text-ink">
      <aside className={`hidden lg:block fixed inset-y-0 left-0 z-40 transition-[width] duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>{sidebar}</aside>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-primary/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 lg:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>{sidebar}</aside>

      <div className={`min-h-screen transition-[margin] duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xl border-b border-lilac/15 flex items-center gap-3 px-4 lg:px-6">
          <button onClick={() => { if (window.innerWidth >= 1024) setCollapsed(v => !v); else { setCollapsed(false); setSidebarOpen(true); } }} className="rounded-xl p-2 text-primary hover:bg-lilac/15" aria-label="Toggle navigation">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
          <div className="hidden min-w-0 flex-1 items-center overflow-hidden text-[11px] text-muted md:flex">
            <span className="shrink-0">QCU InfoBoard</span>
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb}-${index}`} className="contents">
                <span className="mx-2 shrink-0 text-lilac">/</span>
                <span className={`truncate ${index === breadcrumbs.length - 1 ? 'font-medium text-primary' : ''}`}>{crumb}</span>
              </span>
            ))}
          </div>
          <button onClick={() => navigate(currentUser.username === 'doc.atienza' ? 'president-search-filter' : 'global-search')} className="ml-auto hidden md:flex items-center gap-2 w-56 shrink-0 rounded-xl border border-lilac/20 bg-surface px-3 py-2 text-xs text-muted hover:border-lilac">{icons.search}<span>Search insights…</span><span className="ml-auto font-mono text-[9px]">⌘ K</span></button>
          <div className="hidden xl:block font-mono text-[11px] text-muted border-l border-lilac/20 pl-4 whitespace-nowrap">{clock}</div>
          <div className="relative" ref={notifRef}>
            <button onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }} className="relative rounded-xl p-2 text-primary hover:bg-lilac/15" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9m-7 13a2 2 0 01-4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-golden text-primary text-[9px] font-bold flex items-center justify-center">{unread}</span>}
            </button>
            {notifOpen && <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white border border-lilac/20 shadow-2xl overflow-hidden">
              <div className="p-4 flex justify-between border-b border-lilac/15"><p className="text-sm font-bold text-primary">Notifications</p><span className="text-[10px] text-coa font-semibold">All read</span></div>
              {notifications.map(n => <div key={n.id} className="p-4 flex gap-3 border-b border-lilac/10 hover:bg-blossom/20"><span className="w-8 h-8 rounded-xl bg-lilac/15 text-primary flex items-center justify-center shrink-0">{n.type === 'lock' ? icons.validation : n.type === 'upload' ? icons.upload : icons.file}</span><div><p className="text-xs text-primary leading-relaxed">{n.message}</p><p className="text-[10px] text-muted mt-1">{n.time}</p></div></div>)}
            </div>}
          </div>
          <button onClick={() => { setCollapsed(false); if (window.innerWidth < 1024) setSidebarOpen(true); }} className="flex items-center gap-2 rounded-xl p-1.5 pr-2 hover:bg-lilac/10" title="Open account and navigation">
            <span className="w-8 h-8 rounded-xl bg-primary text-golden flex items-center justify-center text-xs font-bold">{currentUser.initials}</span>
            <span className="hidden sm:block text-left"><span className="block text-xs font-semibold text-primary max-w-32 truncate">{currentUser.name}</span><span className="block text-[9px] text-muted">{roleLabel}</span></span>
          </button>
        </header>

        <main>
          <div className="px-4 lg:px-6 pt-5 pb-3 flex items-end justify-between gap-4">
            <div><h1 className="text-2xl font-bold tracking-tight text-primary">{page[0]}</h1><p className="text-xs text-muted mt-1">{page[1]}</p></div>
            <span className={`hidden sm:flex items-center gap-2 rounded-full px-3 py-1 text-[9px] font-bold ${['president-research-excellence', 'president-community-synergy', 'president-supportive-infrastructures', 'president-governance-excellence'].includes(currentScreen) ? 'border border-golden/30 bg-golden/10 text-obsidian' : 'border border-coa/20 bg-coa/5 text-coa'}`}><span className={`w-1.5 h-1.5 rounded-full ${['president-research-excellence', 'president-community-synergy', 'president-supportive-infrastructures', 'president-governance-excellence'].includes(currentScreen) ? 'bg-golden' : 'bg-coa animate-pulse'}`} />{['president-research-excellence', 'president-community-synergy', 'president-supportive-infrastructures', 'president-governance-excellence'].includes(currentScreen) ? 'PROTOTYPE DATA' : 'LIVE SYSTEM'}</span>
          </div>

          {['dean', 'registrar', 'executive'].includes(currentUser.role) && FILTER_SCREENS.includes(currentScreen) && <FilterBar />}
          <div className="px-4 lg:px-6 pb-8">{children}</div>
        </main>
      </div>
      {showScrollTop && (
        <button
          type="button"
          aria-label="Scroll to top"
          title="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-30 w-11 h-11 rounded-2xl bg-primary text-white shadow-xl flex items-center justify-center hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-lilac/30">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 19V5m0 0L6 11m6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
      <Toast /><Modal />
    </div>
  );
}
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AppUser, FilterState, ModalConfig, NotificationItem, ScreenId, ToastMsg } from '../types';
import { NOTIFICATIONS } from '../data/mockData';

interface AppContextValue {
  currentUser: AppUser | null;
  setCurrentUser: (u: AppUser | null) => void;
  currentScreen: ScreenId;
  navigate: (s: ScreenId) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  toasts: ToastMsg[];
  showToast: (t: Omit<ToastMsg, 'id'>) => void;
  modal: ModalConfig | null;
  showModal: (cfg: ModalConfig) => void;
  closeModal: () => void;
  notifications: NotificationItem[];
  markAllRead: () => void;
  notifOpen: boolean;
  setNotifOpen: (v: boolean) => void;
}

const DEFAULT_FILTERS: FilterState = {
  academicYear: '2026–2027',
  semester: 'All',
  campus: 'All',
  college: 'All',
  program: 'All',
  yearLevel: 'All',
  studentStatus: 'All',
  studentType: 'All',
  ageRange: 'All',
  firstGenStatus: 'All',
  employmentStatus: 'All',
  scholarship: 'All',
  incomeBracket: 'All',
};

const NOOP = () => {};
const DEFAULT_CTX: AppContextValue = {
  currentUser: null, setCurrentUser: NOOP,
  currentScreen: 'login', navigate: NOOP as AppContextValue['navigate'],
  filters: DEFAULT_FILTERS, setFilters: NOOP as AppContextValue['setFilters'], resetFilters: NOOP,
  sidebarOpen: false, setSidebarOpen: NOOP,
  toasts: [], showToast: NOOP as AppContextValue['showToast'],
  modal: null, showModal: NOOP as AppContextValue['showModal'], closeModal: NOOP,
  notifications: [], markAllRead: NOOP,
  notifOpen: false, setNotifOpen: NOOP,
};

const AppContext = createContext<AppContextValue>(DEFAULT_CTX);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('login');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [modal, setModal] = useState<ModalConfig | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);

  const navigate = useCallback((s: ScreenId) => {
    setCurrentScreen(s);
    setSidebarOpen(false);
  }, []);

  const resetFilters = useCallback(() => setFilters({
    ...DEFAULT_FILTERS,
    college: currentUser?.role === 'dean' ? currentUser.college ?? 'All' : 'All',
  }), [currentUser]);

  const showToast = useCallback((t: Omit<ToastMsg, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4000);
  }, []);

  const showModal = useCallback((cfg: ModalConfig) => setModal(cfg), []);
  const closeModal = useCallback(() => setModal(null), []);

  const markAllRead = useCallback(() =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true }))), []);

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      currentScreen, navigate,
      filters, setFilters, resetFilters,
      sidebarOpen, setSidebarOpen,
      toasts, showToast,
      modal, showModal, closeModal,
      notifications, markAllRead,
      notifOpen, setNotifOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

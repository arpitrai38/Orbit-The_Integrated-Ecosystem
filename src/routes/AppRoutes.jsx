import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { ROUTES } from './routeConfig';

// Core Dashboard Pages
const LandingPage = lazy(() => import('../pages/LandingPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const FacultyDashboardPage = lazy(() => import('../pages/faculty/FacultyDashboardPage'));
const StudentDashboardPage = lazy(() => import('../pages/student/StudentDashboardPage'));
const ParentDashboardPage = lazy(() => import('../pages/parent/ParentDashboardPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Dedicated Module Pages
const StaffManagementPage = lazy(() => import('../pages/modules/StaffManagementPage'));
const ClassesPage = lazy(() => import('../pages/modules/ClassesPage'));
const StudentsPage = lazy(() => import('../pages/modules/StudentsPage'));
const AttendancePage = lazy(() => import('../pages/modules/AttendancePage'));
const LessonPlansPage = lazy(() => import('../pages/modules/LessonPlansPage'));
const AssignmentsPage = lazy(() => import('../pages/modules/AssignmentsPage'));
const QuizBuilderPage = lazy(() => import('../pages/modules/QuizBuilderPage'));
const ResultsPage = lazy(() => import('../pages/modules/ResultsPage'));
const TimetablePage = lazy(() => import('../pages/modules/TimetablePage'));
const HomeworkPage = lazy(() => import('../pages/modules/HomeworkPage'));
const CommunicationPage = lazy(() => import('../pages/modules/CommunicationPage'));
const LibraryPage = lazy(() => import('../pages/modules/LibraryPage'));
const ReportsPage = lazy(() => import('../pages/modules/ReportsPage'));
const LeaveManagementPage = lazy(() => import('../pages/modules/LeaveManagementPage'));
const FeesPage = lazy(() => import('../pages/modules/FeesPage'));
const LiveClassesPage = lazy(() => import('../pages/modules/LiveClassesPage'));
const TransportPage = lazy(() => import('../pages/modules/TransportPage'));
const CampusSafetyPage = lazy(() => import('../pages/modules/CampusSafetyPage'));
const SettingsPage = lazy(() => import('../pages/modules/SettingsPage'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen fullscreen message="Loading ORBIT Workspace..." />}>
      <Routes>
        {/* Public & General App Routes in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.PUBLIC.LANDING} element={<LandingPage />} />

          {/* 4 Role Dashboards */}
          <Route path={ROUTES.ADMIN.ROOT} element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboardPage />} />

          <Route path={ROUTES.FACULTY.ROOT} element={<Navigate to={ROUTES.FACULTY.DASHBOARD} replace />} />
          <Route path={ROUTES.FACULTY.DASHBOARD} element={<FacultyDashboardPage />} />

          <Route path={ROUTES.STUDENT.ROOT} element={<Navigate to={ROUTES.STUDENT.DASHBOARD} replace />} />
          <Route path={ROUTES.STUDENT.DASHBOARD} element={<StudentDashboardPage />} />

          <Route path={ROUTES.PARENT.ROOT} element={<Navigate to={ROUTES.PARENT.DASHBOARD} replace />} />
          <Route path={ROUTES.PARENT.DASHBOARD} element={<ParentDashboardPage />} />

          {/* Dedicated Core Modules */}
          <Route path={ROUTES.MODULES.STAFF} element={<StaffManagementPage />} />
          <Route path={ROUTES.MODULES.STUDENTS} element={<StudentsPage />} />
          <Route path={ROUTES.MODULES.CLASSES} element={<ClassesPage />} />
          <Route path={ROUTES.MODULES.FEES} element={<FeesPage />} />
          <Route path={ROUTES.MODULES.TRANSPORT} element={<TransportPage />} />
          <Route path={ROUTES.MODULES.ATTENDANCE} element={<AttendancePage />} />
          <Route path={ROUTES.MODULES.LESSON_PLANS} element={<LessonPlansPage />} />
          <Route path={ROUTES.MODULES.ASSIGNMENTS} element={<AssignmentsPage />} />
          <Route path={ROUTES.MODULES.QUIZ_BUILDER} element={<QuizBuilderPage />} />
          <Route path={ROUTES.MODULES.RESULTS} element={<ResultsPage />} />
          <Route path={ROUTES.MODULES.TIMETABLE} element={<TimetablePage />} />
          <Route path={ROUTES.MODULES.HOMEWORK} element={<HomeworkPage />} />
          <Route path={ROUTES.MODULES.COMMUNICATION} element={<CommunicationPage />} />
          <Route path={ROUTES.MODULES.LIBRARY} element={<LibraryPage />} />
          <Route path={ROUTES.MODULES.REPORTS} element={<ReportsPage />} />
          <Route path={ROUTES.MODULES.LEAVES} element={<LeaveManagementPage />} />
          <Route path={ROUTES.MODULES.FEES} element={<FeesPage />} />
          <Route path={ROUTES.MODULES.LIVE_CLASSES} element={<LiveClassesPage />} />
          <Route path={ROUTES.MODULES.TRANSPORT} element={<TransportPage />} />
          <Route path={ROUTES.MODULES.CAMPUS_SAFETY} element={<CampusSafetyPage />} />
          <Route path={ROUTES.MODULES.SETTINGS} element={<SettingsPage />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Authentication Routes in AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

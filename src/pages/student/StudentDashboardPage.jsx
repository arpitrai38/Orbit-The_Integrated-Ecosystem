import React from 'react';
import { RoleEmptyDashboard } from '../../components/dashboard/RoleEmptyDashboard';
import { ROUTES } from '../../routes/routeConfig';
export const StudentDashboardPage = () => <RoleEmptyDashboard title="Student Learning Hub" description="Your timetable, enrolled courses, assignments, results and attendance will appear after your institute adds them." actionLabel="View timetable" actionRoute={ROUTES.MODULES.TIMETABLE}/>;
export default StudentDashboardPage;

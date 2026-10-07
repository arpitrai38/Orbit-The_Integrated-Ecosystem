import React from 'react';
import { RoleEmptyDashboard } from '../../components/dashboard/RoleEmptyDashboard';
import { ROUTES } from '../../routes/routeConfig';
export const FacultyDashboardPage = () => <RoleEmptyDashboard title="Faculty Academic Suite" description="Your teaching, classes, assessments and learner activity will appear here." actionLabel="Open my classes" actionRoute={ROUTES.MODULES.CLASSES}/>;
export default FacultyDashboardPage;

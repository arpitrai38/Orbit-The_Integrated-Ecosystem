import React from 'react';
import { RoleEmptyDashboard } from '../../components/dashboard/RoleEmptyDashboard';
import { ROUTES } from '../../routes/routeConfig';
export const ParentDashboardPage = () => <RoleEmptyDashboard title="Parent & Guardian Portal" description="Linked student attendance, fees, progress and notices will appear when the administration creates the records." actionLabel="Open communication" actionRoute={ROUTES.MODULES.COMMUNICATION}/>;
export default ParentDashboardPage;

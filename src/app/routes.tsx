import { Navigate, type RouteObject } from 'react-router-dom';
import Layout from './components/Layout';
import ActiveRentalsPage from './pages/active-rentals/ActiveRentalsPage';
import ActiveRentalsLayout from './pages/active-rentals/ActiveRentalsLayout';
import ActiveRentalDetailPage from './pages/active-rentals/ActiveRentalDetailPage';
import ActiveRentalLandlordPage from './pages/active-rentals/ActiveRentalLandlordPage';
import ActiveRentalInspectionPage from './pages/active-rentals/ActiveRentalInspectionPage';
import ActiveRentalTenantPage from './pages/active-rentals/ActiveRentalTenantPage';
import ActiveRentalContractPage from './pages/active-rentals/ActiveRentalContractPage';
import ActiveRentalAutoFillPage from './pages/active-rentals/ActiveRentalAutoFillPage';
import HostPage from './pages/host/HostPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/active-rentals" replace /> },
      { path: 'active-rentals', element: <ActiveRentalsPage /> },
      { path: 'host', element: <HostPage /> },
      {
        path: 'active-rentals/:id',
        element: <ActiveRentalsLayout />,
        children: [
          { index: true, element: <ActiveRentalDetailPage /> },
          { path: 'landlord', element: <ActiveRentalLandlordPage /> },
          { path: 'inspection', element: <ActiveRentalInspectionPage /> },
          { path: 'tenant', element: <ActiveRentalTenantPage /> },
          { path: 'contract', element: <ActiveRentalContractPage /> },
          { path: 'auto-fill', element: <ActiveRentalAutoFillPage /> },
        ],
      },
    ],
  },
];

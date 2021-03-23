import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Ordersync from '@/pages/Ordersync';
import Apply from '@/pages/Apply';
import ApplySuccess from '@/pages/ApplySuccess';
import UploadBatch from '@/pages/UploadBatch';
import UploadIdcard from '@/pages/UploadIdcard';
import Parcels from '@/pages/Parcels';
import ParcelDetails from '@/pages/ParcelDetails';
import Auth from '@/pages/Auth';
import Address from '@/pages/Address';


const routerConfig = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/dashboard',
        component: Dashboard
      },
      {
        path: '/ordersync',
        component: Ordersync
      },
      {
        path: 'apply',
        component: Apply
      },
      {
        path: '/applysuccess',
        component: ApplySuccess
      },
      {
        path: '/uploadbatch',
        component: UploadBatch
      },
      {
        path: '/uploadidcard',
        component: UploadIdcard
      },
      {
        path: '/parcels',
        component: Parcels
      },
      {
        path: '/parceldetails',
        component: ParcelDetails
      },
      {
        path: '/auth',
        component: Auth
      },
      {
        path: '/address',
        component: Address
      },
      {
        path: '/',
        component: Dashboard,
      }
    ],
  },
];
export default routerConfig;

// ProtectedRoute.tsx
import {Navigate, useLocation} from 'react-router';
import {useUserContext} from '../hooks/contextHooks';

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const {user} = useUserContext();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{from: location}} />;
  }
  return children;
};

export default ProtectedRoute;

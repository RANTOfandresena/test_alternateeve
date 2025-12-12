import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

type Props = {
  isAllowed: boolean;
  redirectTo: string;
  children: ReactNode;
};

const RouteGuard = ({ isAllowed, redirectTo, children }: Props) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};

export default RouteGuard;


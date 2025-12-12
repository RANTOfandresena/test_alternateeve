import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  children: ReactNode;
}

const AuthContainer = ({ title, subtitle, footer, children }: Props) => (
  <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-slate-200/80 p-8">
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="text-slate-600 text-sm">{subtitle}</p>}
    </div>
    <div className="mt-6">{children}</div>
    {footer && <div className="mt-6">{footer}</div>}
  </div>
);

export default AuthContainer;


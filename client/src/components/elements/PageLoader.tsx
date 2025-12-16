type PageLoaderProps = {
  className?: string;
};

const PageLoader: React.FC<PageLoaderProps> = ({ className }) => (
  <div className={`flex items-center justify-center h-full ${className || ''}`}>
    <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
  </div>
);

export default PageLoader;
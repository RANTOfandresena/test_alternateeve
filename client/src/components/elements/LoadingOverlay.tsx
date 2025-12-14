const LoadingOverlay = () => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-8">
      <div className="animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-48 mb-6"></div>
        
        {/* Stats skeleton */}
        <div className="flex gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-200 rounded"></div>
              <div>
                <div className="h-4 bg-slate-200 rounded w-12 mb-1"></div>
                <div className="h-6 bg-slate-200 rounded w-8"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Cards skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
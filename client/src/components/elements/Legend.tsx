const Legend = ({ showCount = true }) => (
  <div className="mt-4 flex flex-wrap gap-4 text-sm">
    <div className="flex items-center gap-2">
      <span className="w-4 h-4 rounded bg-yellow-100 border-b border-slate-300" />
      <span>En attente</span>
    </div>

    <div className="flex items-center gap-2">
      <span className="w-4 h-4 rounded bg-green-200 border-b border-slate-300" />
      <span>Accepté</span>
    </div>

    <div className="flex items-center gap-2">
      <span className="w-4 h-4 rounded bg-red-200 border-b border-slate-300" />
      <span>Refusé</span>
    </div>

    <div className="flex items-center gap-2">
      <span className="w-4 h-4 rounded bg-gray-100 border-b border-slate-300" />
      <span>Week-end / Jour férié</span>
    </div>

    {showCount && (
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-blue-500 rounded-full">
          n
        </span>
        <span>Nombre d’employés en congé ce jour</span>
      </div>
    )}
  </div>
);

export default Legend;
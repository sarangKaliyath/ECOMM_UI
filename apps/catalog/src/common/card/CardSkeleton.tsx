const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-full animate-pulse">
    <div className="h-40 bg-gray-200" />

    <div className="flex flex-col flex-1 p-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mt-1" />

      <div className="mt-2 flex items-center gap-2">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>

      <div className="h-3 bg-gray-200 rounded w-1/4 mt-0.5" />

      <div className="h-9 bg-gray-200 rounded-xl w-full mt-3" />
    </div>
  </div>
);

export default CardSkeleton;

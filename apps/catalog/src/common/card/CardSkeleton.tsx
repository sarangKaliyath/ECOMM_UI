const CardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col h-full border border-gray-100 animate-pulse">
    <div className="h-64 bg-gray-200" />

    <div className="flex flex-col flex-1 p-4 gap-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-5 bg-gray-200 rounded w-1/2" />

      <div className="h-7 bg-gray-200 rounded w-1/3 mt-1" />

      <div className="mt-auto pt-4">
        <div className="h-11 bg-gray-200 rounded-lg w-full" />
      </div>
    </div>
  </div>
);

export default CardSkeleton;

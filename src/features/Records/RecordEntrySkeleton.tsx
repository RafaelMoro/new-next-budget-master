export const RecordEntrySkeleton = () => {
  return (
    <article data-testid="record-entry-skeleton" className="md:p-2 rounded-lg grid grid-rows-3 grid-view-records gap-2 transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer">
      <span className="col-span-3 text-center text-gray-600 dark:text-gray-400 text-sm bg-slate-500 rounded animate-pulse"></span>
      <div className="col-start-1 col-end-2 row-start-2 row-end-4 flex items-center h-14 w-6 bg-slate-500 rounded animate-pulse"></div>
      <h5 className="col-start-2 col-end-3 row-start-2 row-end-3 text-xl font-semibold capitalize h-7 bg-slate-500 rounded animate-pulse"></h5>
      <p className="col-start-2 col-end-3 row-start-3 row-end-4 h-7 bg-slate-500 rounded animate-pulse"></p>
      <div className="col-start-3 col-end-4 row-span-2 w-full flex items-center justify-center">
        <span className="w-14 h-4 bg-slate-500 rounded animate-pulse"></span>
      </div>
    </article>
  )
}
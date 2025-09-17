export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin"></div>
          <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-purple-400 rounded-full animate-spin animation-delay-150"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">HotDrops</h2>
        <p className="text-blue-200 mb-4">Loading premium experience...</p>
        <div className="flex items-center justify-center gap-2 text-sm text-blue-300">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-100"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
        </div>
      </div>
    </div>
  );
}
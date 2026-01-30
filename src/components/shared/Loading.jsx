export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-admin-200 border-t-admin-600 rounded-full animate-spin" />
        <p className="text-admin-500 text-sm">{message}</p>
      </div>
    </div>
  );
}

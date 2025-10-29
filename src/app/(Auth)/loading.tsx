export default function Loading() {
  return (
    <div className="animate-pulse min-h-screen flex flex-col gap-6 p-5 container mx-auto">
      {/* Simulated top banner */}
      <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />

      {/* Simulated main + sidebar */}
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 h-[400px] bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="hidden lg:block w-[20%] h-[400px] bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>
    </div>
  );
}

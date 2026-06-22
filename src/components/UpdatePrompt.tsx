import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-slate-800 border border-green-500 text-white rounded-2xl p-4 shadow-2xl max-w-md mx-auto">
      <div className="font-black text-lg">
        🔄 Ny version klar
      </div>

      <div className="text-sm text-slate-300 mt-1">
        Tryk her for at opdatere appen.
      </div>

      <button
        onClick={() => updateServiceWorker(true)}
        className="mt-3 w-full bg-green-600 hover:bg-green-500 rounded-xl py-3 font-black"
      >
        Opdater app
      </button>
    </div>
  );
}
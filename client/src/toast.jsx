import { createContext, useCallback, useContext, useState } from "react";

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const show = useCallback((message, type = "ok") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <ToastCtx.Provider value={show}>
      {children}
      {toast && (
        <div className={`toast ${toast.type === "err" ? "err" : ""}`}>
          {toast.message}
        </div>
      )}
    </ToastCtx.Provider>
  );
}

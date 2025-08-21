"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { useToast, type Toast } from "@/lib/hooks/useToast"
import { Toast as ToastComponent } from "@/components/ui/toast"

const ToastContext = createContext<{
  toast: (toast: Omit<Toast, "id">) => string
  dismiss: (id: string) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toast, dismiss, toasts } = useToast()

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} {...toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider")
  }
  return context
}

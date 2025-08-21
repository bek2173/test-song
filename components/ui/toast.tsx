"use client"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
  onDismiss: (id: string) => void
}

export function Toast({ id, title, description, variant = "default", onDismiss }: ToastProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        {
          "border-border bg-background text-foreground": variant === "default",
          "border-destructive/50 bg-destructive text-destructive-foreground": variant === "destructive",
          "border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50": variant === "success",
        },
      )}
    >
      <div className="grid gap-1">
        <div className="text-sm font-semibold">{title}</div>
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      <Button variant="ghost" size="sm" className="absolute right-2 top-2 h-6 w-6 p-0" onClick={() => onDismiss(id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

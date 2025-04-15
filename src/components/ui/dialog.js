"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"


const Dialog = ({ open, onOpenChange, children }) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} modal={false}>
    {children}
  </DialogPrimitive.Root>
)

const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      onPointerDownOutside={(e) => e.preventDefault()}
      onInteractOutside={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => e.preventDefault()}
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center p-4",
        "overflow-y-auto",
        className
      )}
      
      {...props}
    >

<div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6">
  <DialogPrimitive.Close
    aria-label="Close"
    className="absolute top-4 right-4 rounded-full p-1.5 bg-gray-500 text-white hover:bg-gray-600 transition"
  >
    <X className="w-5 h-5" />
  </DialogPrimitive.Close>
  {children}
</div>


    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("mb-4", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex justify-end space-x-2 mt-4", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-2xl font-bold text-[#990e15]", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500 mt-1", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

const DialogClose = DialogPrimitive.Close

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

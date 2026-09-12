"use client"

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { cn } from "cn"

function Sheet(props: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root {...props} />
}

function SheetTrigger({ className, ...props }: DrawerPrimitive.Trigger.Props) {
  return (
    <DrawerPrimitive.Trigger
      data-slot="sheet-trigger"
      className={className}
      {...props}
    />
  )
}

function SheetClose({ className, ...props }: DrawerPrimitive.Close.Props) {
  return (
    <DrawerPrimitive.Close
      data-slot="sheet-close"
      className={className}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  ...props
}: DrawerPrimitive.Popup.Props) {
  return (
    <DrawerPrimitive.Portal data-slot="sheet-portal">
      <DrawerPrimitive.Backdrop
        className="fixed inset-0 z-50 min-h-dvh bg-foreground/40 backdrop-blur-sm transition-opacity data-[swiping]:duration-0 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
      />
      <DrawerPrimitive.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
        <DrawerPrimitive.Popup
          data-slot="sheet-content"
          className={cn(
            "w-full max-w-lg rounded-t-3xl border-t border-border bg-card px-5 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] text-card-foreground shadow-lg outline-none [transform:translateY(var(--drawer-swipe-movement-y))] transition-transform data-[swiping]:duration-0 data-[ending-style]:[transform:translateY(100%)] data-[starting-style]:[transform:translateY(100%)]",
            className
          )}
          {...props}
        >
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted-foreground/30" />
          <DrawerPrimitive.Content>{children}</DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("mb-4 flex flex-col gap-1 text-center", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-6 flex flex-col gap-2.5 sm:gap-3", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-base font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

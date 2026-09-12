"use client"

import { createContext, useContext } from "react"
import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./Sheet"

/**
 * Modal responsive: bottom-sheet (kéo-thả để đóng) trên mobile, dialog căn giữa trên desktop.
 * Dùng thay cho mọi `fixed inset-0 bg-black/60` tự chế trước đây — 1 component, 2 cách render.
 */

const ModalModeContext = createContext(false) // true = mobile (sheet)

function useIsMobileModal() {
  return useContext(ModalModeContext)
}

interface ModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  children?: React.ReactNode
}

function Modal({ children, ...props }: ModalProps) {
  const isMobile = useMediaQuery("(max-width: 767px)")
  const Root = isMobile ? Sheet : Dialog
  return (
    <ModalModeContext.Provider value={isMobile}>
      <Root {...props}>{children}</Root>
    </ModalModeContext.Provider>
  )
}

function ModalTrigger(props: React.ComponentProps<"button">) {
  const isMobile = useIsMobileModal()
  return isMobile ? <SheetTrigger {...props} /> : <DialogTrigger {...props} />
}

function ModalClose(props: React.ComponentProps<"button">) {
  const isMobile = useIsMobileModal()
  return isMobile ? <SheetClose {...props} /> : <DialogClose {...props} />
}

function ModalContent(props: React.ComponentProps<"div"> & { showClose?: boolean }) {
  const isMobile = useIsMobileModal()
  return isMobile ? <SheetContent {...props} /> : <DialogContent {...props} />
}

function ModalHeader(props: React.ComponentProps<"div">) {
  const isMobile = useIsMobileModal()
  return isMobile ? <SheetHeader {...props} /> : <DialogHeader {...props} />
}

function ModalFooter(props: React.ComponentProps<"div">) {
  const isMobile = useIsMobileModal()
  return isMobile ? <SheetFooter {...props} /> : <DialogFooter {...props} />
}

function ModalTitle(props: React.ComponentProps<"h2">) {
  const isMobile = useIsMobileModal()
  return isMobile ? <SheetTitle {...props} /> : <DialogTitle {...props} />
}

function ModalDescription(props: React.ComponentProps<"p">) {
  const isMobile = useIsMobileModal()
  return isMobile ? <SheetDescription {...props} /> : <DialogDescription {...props} />
}

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
}

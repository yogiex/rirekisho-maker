import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const Form = React.forwardRef<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>(
  ({ className, ...props }, ref) => (
    <form ref={ref} className={cn("space-y-6", className)} {...props} />
  )
)
Form.displayName = "Form"

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  )
)
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ComponentRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
  <Label ref={ref} className={cn("text-sm font-medium", className)} {...props} />
))
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <div ref={ref} {...props} />
)
FormControl.displayName = "FormControl"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { error?: string }
>(({ className, children, error, ...props }, ref) => {
  const message = error || children
  if (!message) return null
  return (
    <p ref={ref} className={cn("text-xs text-destructive", className)} role="alert" {...props}>
      {message}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export { Form, FormItem, FormLabel, FormControl, FormMessage }

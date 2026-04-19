import * as React from "react"

import { Label } from "#/components/ui/label"
import { cn } from "#/lib/utils"

type FormFieldStateLike = {
  state: {
    meta: {
      isTouched?: boolean
      errorMap?: Record<string, unknown>
    }
  }
}

function normalizeFieldErrors(value: unknown): string[] {
  if (!value) {
    return []
  }

  if (typeof value === "string") {
    return [value]
  }

  if (value instanceof Error) {
    return [value.message]
  }

  if (Array.isArray(value)) {
    return value.flatMap(normalizeFieldErrors)
  }

  if (typeof value === "object") {
    if ("message" in value && typeof value.message === "string") {
      return [value.message]
    }

    if ("errors" in value && Array.isArray(value.errors)) {
      return value.errors.flatMap(normalizeFieldErrors)
    }
  }

  return []
}

export function getFieldErrors(field: FormFieldStateLike) {
  return Object.values(field.state.meta.errorMap ?? {}).flatMap(normalizeFieldErrors)
}

export function getFieldErrorText(field: FormFieldStateLike) {
  return getFieldErrors(field)[0]
}

export function isFieldInvalid(field: FormFieldStateLike) {
  return Boolean(field.state.meta.isTouched && getFieldErrors(field).length > 0)
}

function Field({
  className,
  field,
  ...props
}: React.ComponentProps<"div"> & {
  field: FormFieldStateLike
}) {
  return (
    <div
      data-slot="form-field"
      data-invalid={isFieldInvalid(field) || undefined}
      className={cn("space-y-2", className)}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-field-group"
      className={cn("space-y-1.5", className)}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="form-field-label"
      className={cn("data-[invalid=true]:text-destructive", className)}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-field-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({ className, children, ...props }: React.ComponentProps<"p">) {
  if (!children) {
    return null
  }

  return (
    <p
      data-slot="form-field-error"
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel }

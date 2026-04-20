import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import { Button } from '#/components/ui/button'
import { useSignOutMutation } from '#/features/authentication/hooks/useSignOutMutation'

interface SignOutConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutConfirmationDialog({
  open,
  onOpenChange,
}: SignOutConfirmationDialogProps) {
  const signOutMutation = useSignOutMutation()
  const errorMessage = signOutMutation.error instanceof Error
    ? signOutMutation.error.message
    : null

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      signOutMutation.reset()
    }

    onOpenChange(nextOpen)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out?</AlertDialogTitle>
          <AlertDialogDescription>
            You&apos;ll need to sign in again to access your workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={signOutMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={signOutMutation.isPending}
            onClick={() => void signOutMutation.mutateAsync().catch(() => null)}
          >
            {signOutMutation.isPending ? 'Signing Out...' : 'Sign Out'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

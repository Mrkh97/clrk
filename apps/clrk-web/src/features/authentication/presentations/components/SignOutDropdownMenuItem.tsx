import { LogOut } from 'lucide-react'
import { DropdownMenuItem } from '#/components/ui/dropdown-menu'

interface SignOutDropdownMenuItemProps {
  onSelect: () => void
}

export function SignOutDropdownMenuItem({ onSelect }: SignOutDropdownMenuItemProps) {
  return (
    <DropdownMenuItem
      variant="destructive"
      onSelect={(event) => {
        event.preventDefault()
        onSelect()
      }}
    >
      <LogOut size={15} />
      Sign Out
    </DropdownMenuItem>
  )
}

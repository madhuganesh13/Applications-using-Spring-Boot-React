import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

type Props = {
  open: boolean
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void
}
export default function ConfirmDialog({ open, title, message, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Delete</Button>
      </DialogActions>
    </Dialog>
  )
}

import { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid as Grid, TextField, MenuItem } from '@mui/material'
import dayjs from 'dayjs'
import type { Student }  from '../types'

type Props = {
  open: boolean
  initial?: Student
  onClose: () => void
  onSubmit: (payload: Omit<Student, 'id'>) => void
}

const genders = ['Male','Female','Other']

export default function StudentFormDialog({ open, initial, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<Omit<Student,'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: null,
    gender: 'Other',
    department: '',
    gpa: 0
  })
  const [errors, setErrors] = useState<Record<string,string>>({})

  useEffect(() => {
    if (initial) {
      setForm({
        firstName: initial.firstName,
        lastName: initial.lastName,
        email: initial.email,
        dateOfBirth: initial.dateOfBirth,
        gender: initial.gender,
        department: initial.department,
        gpa: initial.gpa
      })
    } else {
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: null,
        gender: 'Other',
        department: '',
        gpa: 0
      })
    }
  }, [initial, open])

  const handleChange = (field: keyof Omit<Student,'id'>, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const e: Record<string,string> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (form.dateOfBirth && dayjs(form.dateOfBirth).isAfter(dayjs())) e.dateOfBirth = 'Must be in the past'
    if (!form.department.trim()) e.department = 'Required'
    if (form.gpa < 0 || form.gpa > 10) e.gpa = '0 to 10'
    if (!genders.includes(form.gender)) e.gender = 'Invalid'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = () => {
    if (!validate()) return
    onSubmit(form)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Edit Student' : 'Add Student'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs:12, md:6 }}>
            <TextField label="First Name" value={form.firstName}
              onChange={e => handleChange('firstName', e.target.value)}
              fullWidth error={!!errors.firstName} helperText={errors.firstName}/>
          </Grid>
          <Grid size={{ xs:12, md:6 }}>
            <TextField label="Last Name" value={form.lastName}
              onChange={e => handleChange('lastName', e.target.value)}
              fullWidth error={!!errors.lastName} helperText={errors.lastName}/>
          </Grid>
          <Grid size={{ xs:12, md:6 }}>
            <TextField label="Email" value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              fullWidth error={!!errors.email} helperText={errors.email}/>
          </Grid>
          <Grid size={{ xs:12, md:6 }}>
            <TextField type="date" label="Date of Birth" value={form.dateOfBirth ?? ''}
              onChange={e => handleChange('dateOfBirth', e.target.value || null)}
              fullWidth InputLabelProps={{ shrink: true }} error={!!errors.dateOfBirth} helperText={errors.dateOfBirth}/>
          </Grid>
          <Grid size={{ xs:12, md:6 }}>
            <TextField select label="Gender" value={form.gender}
              onChange={e => handleChange('gender', e.target.value)}
              fullWidth>
              {genders.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs:12, md:6 }}>
            <TextField label="Department" value={form.department}
              onChange={e => handleChange('department', e.target.value)}
              fullWidth error={!!errors.department} helperText={errors.department}/>
          </Grid>
          <Grid size={{ xs:12, md:6 }}>
            <TextField type="number" label="GPA" value={form.gpa}
              onChange={e => handleChange('gpa', Number(e.target.value))}
              fullWidth inputProps={{ step: 0.1, min: 0, max: 10 }} error={!!errors.gpa} helperText={errors.gpa}/>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submit} variant="contained">{initial ? 'Save' : 'Create'}</Button>
      </DialogActions>
    </Dialog>
  )
}

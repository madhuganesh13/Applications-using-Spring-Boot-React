import { useEffect, useState } from 'react'
import { Snackbar, Alert } from '@mui/material'
import { createStudent, deleteStudent, updateStudent } from '../api/students'
import type { Student } from '../types'
import StudentTable from '../components/StudentTable'
import StudentFormDialog from '../components/StudentFormDialog'
import ConfirmDialog from '../components/ConfirmDialog'

export default function StudentsPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selected, setSelected] = useState<Student | undefined>(undefined)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toast, setToast] = useState<{msg:string, type:'success'|'error'}|null>(null)

  const handleAdd = () => { setSelected(undefined); setFormOpen(true) }
  const handleEdit = (s: Student) => { setSelected(s); setFormOpen(true) }
  const handleDelete = (s: Student) => { setSelected(s); setConfirmOpen(true) }

  const submit = async (payload: Omit<Student,'id'>) => {
    try {
      if (selected?.id) {
        await updateStudent(selected.id, payload)
        setToast({ msg: 'Student updated', type: 'success' })
      } else {
        await createStudent(payload)
        setToast({ msg: 'Student created', type: 'success' })
      }
      setFormOpen(false)
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Failed'
      setToast({ msg, type: 'error' })
    }
  }

  const confirmDelete = async () => {
    try {
      if (selected?.id) {
        await deleteStudent(selected.id)
        setToast({ msg: 'Student deleted', type: 'success' })
      }
    } catch (e:any) {
      const msg = e.response?.data?.message || 'Failed'
      setToast({ msg, type: 'error' })
    } finally {
      setConfirmOpen(false)
    }
  }

  useEffect(() => {}, [])

  return (
    <>
      <StudentTable onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
      <StudentFormDialog open={formOpen} initial={selected} onClose={() => setFormOpen(false)} onSubmit={submit} />
      <ConfirmDialog open={confirmOpen} title="Delete Student" message={`Delete ${selected?.firstName} ${selected?.lastName}?`} onCancel={()=>setConfirmOpen(false)} onConfirm={confirmDelete}/>
      <Snackbar open={!!toast} autoHideDuration={3000} onClose={()=>setToast(null)}>
        <Alert severity={toast?.type || 'info'}>{toast?.msg}</Alert>
      </Snackbar>
    </>
  )
}

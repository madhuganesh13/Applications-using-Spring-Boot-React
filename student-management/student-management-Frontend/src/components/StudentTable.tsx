import { useEffect, useMemo, useState } from 'react'
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  IconButton, TextField, Toolbar, Tooltip, Button
} from '@mui/material'
import { Add, Delete, Edit, Refresh } from '@mui/icons-material'
import type { Student } from '../types'
import { listStudents } from '../api/students'

type Props = {
  onAdd: () => void
  onEdit: (s: Student) => void
  onDelete: (s: Student) => void
}

export default function StudentTable({ onAdd, onEdit, onDelete }: Props) {
  const [rows, setRows] = useState<Student[]>([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [q, setQ] = useState('')
  const [sortBy, setSortBy] = useState<'id'|'firstName'|'lastName'|'email'|'department'|'gpa'>('id')
  const [direction, setDirection] = useState<'asc'|'desc'>('asc')
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await listStudents({ q, page, size, sortBy, direction })
      setRows(data.content)
      setTotal(data.totalElements)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [page, size, q, sortBy, direction])

  const headers = useMemo(() => ([
    { key: 'id', label: 'ID' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'gpa', label: 'GPA' },
    { key: 'actions', label: 'Actions' }
  ] as const), [])

  const handleSort = (key: typeof headers[number]['key']) => {
    if (key === 'actions') return
    const k = key as any
    if (sortBy === k) setDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortBy(k); setDirection('asc') }
  }

  return (
    <Paper>
      <Toolbar className="table-toolbar">
        <TextField size="small" placeholder="Search name, email, department..." value={q}
          onChange={e => { setPage(0); setQ(e.target.value) }} />
        <Tooltip title="Refresh">
          <IconButton onClick={fetchData}><Refresh /></IconButton>
        </Tooltip>
        <div style={{ flex: 1 }} />
        <Button variant="contained" startIcon={<Add />} onClick={onAdd}>Add Student</Button>
      </Toolbar>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {headers.map(h => (
                <TableCell key={h.key} onClick={() => handleSort(h.key)} style={{ cursor: h.key!=='actions' ? 'pointer' : 'default' }}>
                  {h.label}{sortBy===h.key ? (direction==='asc' ? ' ▲' : ' ▼') : ''}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && rows.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.firstName}</TableCell>
                <TableCell>{r.lastName}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.department}</TableCell>
                <TableCell>{r.gpa.toFixed(1)}</TableCell>
                <TableCell>
                  <Tooltip title="Edit"><IconButton onClick={() => onEdit(r)}><Edit /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton onClick={() => onDelete(r)} color="error"><Delete /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!loading && rows.length===0 && (
              <TableRow><TableCell colSpan={7} align="center">No records</TableCell></TableRow>
            )}
            {loading && (
              <TableRow><TableCell colSpan={7} align="center">Loading...</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination component="div" count={total} page={page}
        onPageChange={(_, p) => setPage(p)} rowsPerPage={size}
        onRowsPerPageChange={e => { setSize(parseInt(e.target.value,10)); setPage(0) }}
        rowsPerPageOptions={[5,10,20,50]} />
    </Paper>
  )
}

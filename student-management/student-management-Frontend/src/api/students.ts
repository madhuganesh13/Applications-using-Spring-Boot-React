import client from './client'
import type { PageResponse, Student } from '../types'

export const listStudents = async (params: {
  q?: string
  page?: number
  size?: number
  sortBy?: string
  direction?: 'asc' | 'desc'
}) => {
  const res = await client.get<PageResponse<Student>>('/students', { params })
  return res.data
}

export const getStudent = async (id: number) => {
  const res = await client.get<Student>(`/students/${id}`)
  return res.data
}

export const createStudent = async (payload: Omit<Student, 'id'>) => {
  const res = await client.post<Student>('/students', payload)
  return res.data
}

export const updateStudent = async (id: number, payload: Omit<Student, 'id'>) => {
  const res = await client.put<Student>(`/students/${id}`, payload)
  return res.data
}

export const deleteStudent = async (id: number) => {
  await client.delete(`/students/${id}`)
}

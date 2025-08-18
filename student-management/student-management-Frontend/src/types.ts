export type Student = {
  id?: number
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string | null
  gender: 'Male' | 'Female' | 'Other'
  department: string
  gpa: number
}

export type PageResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

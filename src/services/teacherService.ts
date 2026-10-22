import { Teacher } from '@/core/types/teacher'
import { MOCK_TEACHERS } from './mockData'

class TeacherService {
  private teachers: Teacher[] = [...MOCK_TEACHERS]

  async getAll(): Promise<Teacher[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...this.teachers]), 150))
  }

  async getById(id: string): Promise<Teacher | null> {
    const found = this.teachers.find((t) => t.id === id)
    return found || null
  }
}

export const teacherService = new TeacherService()

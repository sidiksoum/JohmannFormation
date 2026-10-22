import { BulletinNotes } from '@/core/types/reportCard'
import { MOCK_BULLETIN_OFFICIEL } from './mockData'

class ReportCardService {
  private bulletins: BulletinNotes[] = [MOCK_BULLETIN_OFFICIEL]

  async getByStudentId(studentId: string): Promise<BulletinNotes | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = this.bulletins.find((b) => b.studentId === studentId)
        resolve(found || null)
      }, 100)
    })
  }

  async getAll(): Promise<BulletinNotes[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...this.bulletins]), 150))
  }

  async updateAppreciationConseil(id: string, appreciation: string, decision: string): Promise<boolean> {
    const bul = this.bulletins.find((b) => b.id === id)
    if (!bul) return false
    bul.appreciationConseil = appreciation
    bul.decisionFinFormation = decision
    return true
  }

  async publierBulletin(id: string): Promise<boolean> {
    const bul = this.bulletins.find((b) => b.id === id)
    if (!bul) return false
    bul.statut = 'PUBLIE'
    return true
  }
}

export const reportCardService = new ReportCardService()

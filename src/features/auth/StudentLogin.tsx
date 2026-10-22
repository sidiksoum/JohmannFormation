import React, { useState } from 'react'
import { ArrowLeft, UserCheck, Sparkles, GraduationCap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { HeaderBrand } from '@/components/ui/HeaderBrand'
import { authService } from '@/services/authService'
import { studentService } from '@/services/studentService'
import { Student } from '@/core/types/student'
import { toast } from 'sonner'

interface StudentLoginProps {
  onSuccess: () => void
  onNavigateHome: () => void
}

export function StudentLogin({ onSuccess, onNavigateHome }: StudentLoginProps) {
  const [matricule, setMatricule] = useState('JF-2024-0012')
  const [detectedStudent, setDetectedStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)

  // Auto-detect student preview on typing
  const handleMatriculeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase()
    setMatricule(val)
    if (val.length >= 8) {
      const s = await studentService.getByMatricule(val)
      setDetectedStudent(s)
    } else {
      setDetectedStudent(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!matricule.trim()) {
      toast.error('Veuillez saisir votre matricule étudiant.')
      return
    }

    setLoading(true)
    const session = await authService.loginStudent(matricule)
    setLoading(false)

    if (session) {
      toast.success(`Bienvenue, ${session.nomComplet} !`, {
        description: 'Connexion réussie à votre espace étudiant.',
      })
      onSuccess()
    } else {
      toast.error('Matricule introuvable', {
        description: 'Vérifiez le numéro figurant sur votre reçu ou carte.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between py-8 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto">
        {/* Back Link */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#7A1B29] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </button>

        <Card variant="clean" className="p-8 border border-slate-200/90 shadow-sm">
          {/* Header */}
          <div className="text-center pb-6 border-b border-slate-100">
            <div className="flex justify-center mb-3">
              <HeaderBrand taille="lg" afficherDetails={false} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF9EB] text-[#B45309] border border-[#FDE68A] text-xs font-semibold mt-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Portail étudiant • Accès simplifié</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-3">
              Connexion par matricule
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Saisissez uniquement votre matricule officiel attribué lors de votre inscription.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <Input
              label="Votre matricule étudiant officiel"
              placeholder="Ex: JF-2024-0012"
              value={matricule}
              onChange={handleMatriculeChange}
              required
              className="font-mono text-base font-bold tracking-wider text-[#7A1B29]"
              helperText="Format : JF-AAAA-XXXX (indiqué sur vos reçus)"
            />

            {/* Quick Suggestions for fast UX testing */}
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Exemples de matricules pour tester :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['JF-2024-0012', 'JF-2024-0025', 'JF-2024-0038'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMatricule(m)
                      studentService.getByMatricule(m).then(setDetectedStudent)
                    }}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      matricule === m
                        ? 'bg-[#FDF2F4] text-[#7A1B29] border-[#FBCFE8] font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Student Detection Card */}
            {detectedStudent && (
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3 animate-in fade-in duration-200">
                <img
                  src={detectedStudent.photoUrl}
                  alt={detectedStudent.nom}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-300 shrink-0"
                />
                <div className="text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">
                      {detectedStudent.nom} {detectedStudent.prenoms}
                    </span>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-slate-500 text-[11px]">{detectedStudent.filiere} • {detectedStudent.classe}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Accéder à mon espace
            </Button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Un problème avec votre matricule ?</span>{' '}
            <span className="text-[#7A1B29] font-medium">Contactez la scolarité : 07 59 56 11 50</span>
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-slate-400 mt-6">
        <span>Cabinet de formation agréé par l'État à Grand-Lahou • Décision N° 2012-1425 / METFP</span>
      </div>
    </div>
  )
}

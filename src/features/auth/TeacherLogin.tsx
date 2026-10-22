import React, { useState } from 'react'
import { ArrowLeft, BookOpen, Lock, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { HeaderBrand } from '@/components/ui/HeaderBrand'
import { authService } from '@/services/authService'
import { toast } from 'sonner'

interface TeacherLoginProps {
  onSuccess: () => void
  onNavigateHome: () => void
}

export function TeacherLogin({ onSuccess, onNavigateHome }: TeacherLoginProps) {
  const [identifiant, setIdentifiant] = useState('raji.deen@johmann.edu.ci')
  const [motDePasse, setMotDePasse] = useState('••••••••')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const session = await authService.loginTeacher(identifiant, motDePasse)
    setLoading(false)

    if (session) {
      toast.success(`Session ouverte : ${session.nomComplet}`, {
        description: 'Bienvenue dans votre studio pédagogique.',
      })
      onSuccess()
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold mt-2">
              <BookOpen className="w-3.5 h-3.5 text-[#7A1B29]" />
              <span>Studio pédagogique enseignant</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-3">
              Accès formateur
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Connectez-vous pour concevoir des fiches d'évaluation et saisir vos notes de classe.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email académique ou identifiant"
              type="text"
              placeholder="ex: raji.deen@johmann.edu.ci"
              value={identifiant}
              onChange={(e) => setIdentifiant(e.target.value)}
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              leftIcon={<Lock className="w-4 h-4" />}
            />

            {/* Quick selector for testing */}
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Comptes enseignants de démonstration :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { nom: 'Dr. Raji Deen', email: 'raji.deen@johmann.edu.ci' },
                  { nom: 'Mme SF Kouakou', email: 'sf.kouakou@johmann.edu.ci' },
                  { nom: 'M. Wogou Charles', email: 'charles.wogou@johmann.edu.ci' },
                ].map((p) => (
                  <button
                    key={p.email}
                    type="button"
                    onClick={() => setIdentifiant(p.email)}
                    className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      identifiant === p.email
                        ? 'bg-[#FDF2F4] text-[#7A1B29] border-[#FBCFE8] font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.nom}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Connexion enseignant
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Mot de passe oublié ?</span>{' '}
            <span className="text-[#7A1B29] font-medium cursor-pointer">Demander réinitialisation</span>
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-slate-400 mt-6">
        <span>Portail sécurisé des formateurs • Johmann Formation</span>
      </div>
    </div>
  )
}

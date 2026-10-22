import React, { useState } from 'react'
import { ArrowLeft, ShieldCheck, Lock, User, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { HeaderBrand } from '@/components/ui/HeaderBrand'
import { authService } from '@/services/authService'
import { toast } from 'sonner'

interface AdminLoginProps {
  onSuccess: () => void
  onNavigateHome: () => void
}

export function AdminLogin({ onSuccess, onNavigateHome }: AdminLoginProps) {
  const [identifiant, setIdentifiant] = useState('admin.direction')
  const [motDePasse, setMotDePasse] = useState('••••••••••••')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const session = await authService.loginAdmin(identifiant, motDePasse)
    setLoading(false)

    if (session) {
      toast.success('Session Administrateur active', {
        description: 'Bienvenue au centre de pilotage, M. MEA KOUAKOU FELIX.',
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F4] text-[#7A1B29] border border-[#FBCFE8] text-xs font-semibold mt-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pilotage central et administration</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-3">
              Connexion direction
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Espace restreint de gestion académique, financière et de validation des bulletins officiels.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Identifiant administrateur"
              type="text"
              placeholder="admin.direction"
              value={identifiant}
              onChange={(e) => setIdentifiant(e.target.value)}
              required
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Mot de passe sécurisé"
              type="password"
              placeholder="••••••••••••"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#7A1B29] shrink-0" />
              <span>Connexion sécurisée TLS avec journalisation de l'audit et de l'IP.</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Accéder au pilotage central
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Accès strictement réservé à la direction des études</span>
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-slate-400 mt-6">
        <span>Administration centrale • Johmann Formation • Grand-Lahou</span>
      </div>
    </div>
  )
}

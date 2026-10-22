import React, { useState, useEffect } from 'react'
import {
  Camera,
  ShieldCheck,
  Clock,
  Wifi,
  WifiOff,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Student } from '@/core/types/student'
import { Evaluation } from '@/core/types/evaluation'
import { MOCK_EVALUATIONS } from '@/services/mockData'
import { usePWA } from '@/hooks/usePWA'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

interface StudentExamRoomProps {
  student: Student
  onExamFinished: () => void
}

export function StudentExamRoom({ student, onExamFinished }: StudentExamRoomProps) {
  const [consentGranted, setConsentGranted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes en secondes
  const [answers, setAnswers] = useState<Record<string, any>>({
    q1: 'opt1',
    q2: 'vf2',
    q3: ['cm1', 'cm2', 'cm3'],
    q4: 'Appliquer un protocole de retournement toutes les 2 heures et signaler à l’infirmier.',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { isOnline } = usePWA()

  const evaluation: Evaluation = MOCK_EVALUATIONS[0] // Contrôle Soins Infirmiers

  // Timer countdown
  useEffect(() => {
    if (!consentGranted || isSubmitted) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [consentGranted, isSubmitted])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7A1B29', '#C59B27', '#15803D'],
    })
    toast.success('Épreuve soumise avec succès !', {
      description: 'Vos réponses ont été enregistrées et envoyées à la correction.',
    })
  }

  // 1. Consentement préalable Camera (Loi 2013-450)
  if (!consentGranted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card variant="clean" className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#FDF2F4] text-[#7A1B29] border border-[#FBCFE8] flex items-center justify-center mx-auto">
            <Camera className="w-8 h-8" />
          </div>

          <div>
            <Badge variant="johmann" size="md">Protocole de Surveillance Dématérialisée</Badge>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Consentement Préalable de Surveillance Photo
            </h2>
            <p className="text-xs text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
              Pour garantir la valeur officielle de votre attestation et de vos examens, cette épreuve comporte
              une surveillance photo intermittente par webcam, conformément à la loi ivoirienne N° 2013-450 relative à la
              protection des données à caractère personnel.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#7A1B29]" />
              <span>Garanties de protection de vos données :</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-500">
              <li>Aucun enregistrement vidéo continu n'est effectué (uniquement quelques captures horodatées).</li>
              <li>Les photos sont strictement réservées à la Direction des Études de Johmann Formation.</li>
              <li>Destruction automatique des clichés à l’issue de la validation des jurys semestriels.</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => {
                setConsentGranted(true)
                toast.success('Caméra activée. Début de l’épreuve.')
              }}
            >
              J'accepte et je commence l'épreuve
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // 2. Écran de Confirmation après soumission
  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto space-y-6 text-center">
        <Card variant="clean" className="p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Composition Enregistrée !</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Votre copie pour <strong>{evaluation.titre}</strong> a été transmise au formateur.
            Vos captures webcam ont été horodatées et sont en cours de vérification de conformité.
          </p>

          <div className="pt-4">
            <Button variant="primary" onClick={onExamFinished}>
              Retour à mon Tableau de Bord
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // 3. Salle de Composition Interactive
  const currentQ = evaluation.questions[currentQuestionIndex]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Floating Exam Header */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-slate-900 text-sm">{evaluation.titre}</h2>
          <p className="text-xs text-slate-500">
            {evaluation.discipline} • {student.nom} {student.prenoms} ({student.matricule})
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Network Resilience Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Sauvegarde Continue PWA' : 'Hors-ligne (Enregistré localement)'}</span>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-bold text-sm">
            <Clock className="w-4 h-4 text-[#C59B27] animate-pulse" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Questions Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {evaluation.questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestionIndex(idx)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              currentQuestionIndex === idx
                ? 'bg-[#7A1B29] text-white border-[#7A1B29] shadow-sm'
                : answers[q.id]
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Question {idx + 1} ({q.points} pts)
          </button>
        ))}
      </div>

      {/* Question Card */}
      {currentQ && (
        <Card variant="clean" className="p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A1B29]">
              Question {currentQuestionIndex + 1} sur {evaluation.questions.length} • {currentQ.points} points
            </span>
            <Badge variant="neutral">
              {currentQ.type === 'CHOIX_UNIQUE'
                ? 'Choix Unique'
                : currentQ.type === 'VRAI_FAUX'
                ? 'Vrai / Faux'
                : currentQ.type === 'CHOIX_MULTIPLES'
                ? 'Choix Multiples'
                : 'Question Ouverte'}
            </Badge>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {currentQ.enonce}
          </h3>

          {/* Options */}
          {currentQ.options && (
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected =
                  currentQ.type === 'CHOIX_MULTIPLES'
                    ? answers[currentQ.id]?.includes(opt.id)
                    : answers[currentQ.id] === opt.id

                return (
                  <label
                    key={opt.id}
                    onClick={() => {
                      if (currentQ.type === 'CHOIX_MULTIPLES') {
                        const cur = answers[currentQ.id] || []
                        const next = cur.includes(opt.id)
                          ? cur.filter((x: string) => x !== opt.id)
                          : [...cur, opt.id]
                        setAnswers({ ...answers, [currentQ.id]: next })
                      } else {
                        setAnswers({ ...answers, [currentQ.id]: opt.id })
                      }
                    }}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#7A1B29] bg-[#FDF2F4]/60 text-slate-900 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50/70 text-slate-700'
                    }`}
                  >
                    <input
                      type={currentQ.type === 'CHOIX_MULTIPLES' ? 'checkbox' : 'radio'}
                      name={currentQ.id}
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-0.5 text-[#7A1B29] focus:ring-[#7A1B29]"
                    />
                    <span className="text-xs font-medium leading-relaxed">{opt.texte}</span>
                  </label>
                )
              })}
            </div>
          )}

          {currentQ.type === 'QUESTION_OUVERTE' && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Rédigez votre réponse ci-dessous :
              </label>
              <textarea
                rows={4}
                value={answers[currentQ.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                placeholder="Expliquez clairement votre démarche..."
                className="w-full bg-slate-50/50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#7A1B29] focus:bg-white transition-all"
              />
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Question Précédente
            </Button>

            {currentQuestionIndex < evaluation.questions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Question Suivante
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Terminer & Soumettre ma Copie
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

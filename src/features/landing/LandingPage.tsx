import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Phone,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Award,
  MapPin,
  Calendar,
  Sparkles,
  Stethoscope,
  Pill,
  Calculator,
  LogIn,
  UserPlus,
} from 'lucide-react'
import { HeaderBrand } from '@/components/ui/HeaderBrand'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { RegistrationModal } from '@/features/registration/RegistrationModal'

interface LandingPageProps {
  onNavigateLogin: (role: 'STUDENT' | 'TEACHER' | 'ADMIN') => void
}

// Données du carrousel avec images réelles et textes en typographie soignée
const HERO_SLIDES = [
  {
    id: 1,
    tag: 'Formation médicale et soins',
    title: 'Devenez aide-soignante diplômée et reconnue par l’État',
    subtitle:
      'Un enseignement d’excellence à Grand-Lahou alliant cours théoriques rigoureux et stages cliniques en milieu hospitalier.',
    bgImage:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&auto=format&fit=crop&q=80',
    stat: '100% de stages garantis en milieu clinique',
  },
  {
    id: 2,
    tag: 'Sciences pharmaceutiques',
    title: 'Auxiliaire en pharmacie : l’art du conseil officinal',
    subtitle:
      'Maîtrisez la gestion des stocks de médicaments, l’accueil patientèle et la pharmacologie appliquée au sein de notre officine témoin.',
    bgImage:
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1600&auto=format&fit=crop&q=80',
    stat: 'Officine témoin et manipulations pratiques',
  },
  {
    id: 3,
    tag: 'Gestion et commerce',
    title: 'Caissière spécialisée : rigueur et maîtrise des flux',
    subtitle:
      'Formez-vous aux caisses informatisées de dernière génération, à la détection des faux billets et à la relation client d’élite.',
    bgImage:
      'https://img.magnific.com/photos-premium/comptoir-pharmacie-bien-organise-etageres_841543-47211.jpg?semt=ais_hybrid&w=740&q=80',
    stat: 'Logiciels de caisse et terminaux bancaires',
  },
  {
    id: 4,
    tag: 'Innovation et agrément ministériel',
    title: 'Johmann Formation, un leader de l\'enseignement technique en Côte d\'Ivoire',
    subtitle:
      'Johmann Formation modernise la scolarité en Côte d’Ivoire : bulletins certifiés par QR code, reçus PDF numérotés et épreuves surveillées.',
    bgImage:
      'https://www.lintelligentdabidjan.info/news/wp-content/uploads/2025/03/WhatsApp-Image-2025-03-05-at-02.09.50.jpeg',
    stat: 'Agréé METFPA • Décision N° 2012-1425',
  },
]

// Membres de l'équipe pédagogique et direction
const TEAM_MEMBERS = [
  {
    nom: 'M. MEA KOUAKOU FELIX',
    role: 'Directeur des études et fondateur',
    description: 'Plus de 20 ans d’expertise dans la formation technique et professionnelle en Côte d’Ivoire.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    specialite: 'Management pédagogique et relations ministérielles',
  },
  {
    nom: 'Dr. Raji Deen',
    role: 'Formateur référent en soins infirmiers',
    description: 'Médecin praticien hospitalier, formateur principal des promotions d’aide-soignante.',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    specialite: 'Soins infirmiers, santé publique et pédiatrie',
  },
  {
    nom: 'Mme SF Kouakou',
    role: 'Formatrice en gynécologie-obstétrique',
    description: 'Sage-femme spécialiste en santé de la reproduction et soins néonataux.',
    photo: 'https://images.unsplash.com/photo-1594824813589-9a0d31ee9d6e?w=400&auto=format&fit=crop&q=80',
    specialite: 'Gynécologie, obstétrique et puériculture',
  },
  {
    nom: 'M. Wogou Charles',
    role: 'Formateur en hygiène et prévention',
    description: 'Spécialiste de la lutte contre les infections nosocomiales et protocoles de désinfection.',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
    specialite: 'Hygiène hospitalière et gestion des déchets',
  },
  {
    nom: 'Mme TAHIRA Fatou',
    role: 'Responsable de la scolarité et trésorerie',
    description: 'Gestion des inscriptions, encaissements officiels et suivi personnalisé des étudiants.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    specialite: 'Administration et suivi des échéanciers',
  },
  {
    nom: 'M. Yapi Yapo',
    role: 'Formateur en droit et déontologie',
    description: 'Juriste d’entreprise, accompagnateur des apprenants sur l’éthique et le droit du travail.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    specialite: 'Droit du travail et déontologie professionnelle',
  },
]

// Activités de la structure
const ACTIVITIES = [
  {
    titre: 'Stages cliniques en milieu hospitalier',
    frequence: 'Chaque semestre',
    description:
      'Immersion en conditions réelles dans les hôpitaux généraux, CHU et cliniques partenaires pour une pratique clinique intensive.',
    image:
      'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800&auto=format&fit=crop&q=80',
    badge: 'Pratique réelle',
  },
  {
    titre: 'Ateliers de secourisme et gestes d’urgence',
    frequence: '2 fois par mois',
    description:
      'Simulations de réanimation cardio-pulmonaire, pose de garrots et gestion des situations de détresse vitale.',
    image:
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
    badge: 'Sauvetage et urgences',
  },
  {
    titre: 'Cérémonie solennelle de remise des diplômes',
    frequence: 'Annuel',
    description:
      'Événement officiel sous le haut patronage des autorités administratives et coutumières de Grand-Lahou pour célébrer les lauréats.',
    image:
      'https://media-files.abidjan.net/photo/ceremonie-remise-diplomes-universite-grand-bassam-0015.jpg',
    badge: 'Diplômes agréés',
  },
  {
    titre: 'Simulations professionnelles et gestion de caisse',
    frequence: 'Hebdomadaire',
    description:
      'Entraînement sur caisses enregistreuses réelles, logiciels de facturation, comptage rapide et clôture journalière.',
    image:
      'https://www.compte-pro.com/wp-content/uploads/2017/09/Compte-Pro-Logiciel-de-caisse.jpg',
    badge: 'Atelier pratique',
  },
]

export function LandingPage({ onNavigateLogin }: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)

  // Auto-scroll du carrousel toutes les 7 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)

  const activeSlideData = HERO_SLIDES[currentSlide]

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col justify-between selection:bg-[#7A1B29] selection:text-white font-sans text-slate-900">
      {/* 1. Top banner officiel ultra responsive */}
      <div className="bg-[#7A1B29] text-white text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C59B27] animate-pulse shrink-0" />
            <span className="font-semibold tracking-wide truncate max-w-[280px] xs:max-w-sm sm:max-w-none">
              Cabinet de formation agréé par l'État à Grand-Lahou • Décision N° 2012-1425 / METFP / CAB / DEP
            </span>
          </div>
          <div className="flex items-center gap-3 text-white/90 text-[10px] sm:text-[11px] shrink-0 font-mono">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#C59B27]" />
              07 59 56 11 50 / 07 08 37 01 01
            </span>
          </div>
        </div>
      </div>

      {/* 2. Header principal avec boutons Se connecter et S'inscrire */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/50 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2">
          {/* Logo officiel responsive */}
          <div className="shrink-0">
            <HeaderBrand taille="sm" masquerTexteMobile={true} />
          </div>

          {/* Boutons d'action : Se connecter et S'inscrire */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => onNavigateLogin('STUDENT')}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-[#7A1B29] bg-[#FDF2F4] hover:bg-[#F9E2E6] border border-[#FBCFE8] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:shadow-xs shrink-0"
              title="Accès à l'espace étudiant"
            >
              <LogIn className="w-3.5 h-3.5 text-[#7A1B29]" />
              <span className="hidden xs:inline">Se connecter</span>
              <span className="xs:hidden">Connexion</span>
            </button>

            <button
              onClick={() => setIsRegistrationModalOpen(true)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white bg-[#7A1B29] hover:bg-[#631420] border border-transparent rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
              title="Demande d'inscription pour les non affectés"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>S'inscrire</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 3. GRANDE SECTION HERO AVEC CARROUSEL D'IMAGES VISIBLES & COULEUR TRANSPARENTE */}
        <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden border-b border-amber-200/50">
          {/* Images du carrousel avec fondu doux */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlideData.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="absolute inset-0 z-0"
            >
              <img
                src={activeSlideData.bgImage}
                alt={activeSlideData.title}
                className="w-full h-full object-cover object-center"
              />
              {/* Voile transparent léger : magnifie les photographies sans les masquer */}
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-900/35" />
            </motion.div>
          </AnimatePresence>

          {/* Carte translucide découpée pour une lisibilité parfaite des textes */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlideData.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 text-center max-w-3xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1B29] text-white text-xs font-bold tracking-wider shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>{activeSlideData.tag}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto drop-shadow-md">
                  {activeSlideData.title}
                </h1>

                <p className="text-sm sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-xs font-medium">
                  {activeSlideData.subtitle}
                </p>

                <div className="pt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-md bg-white/20 text-white border border-white/30 backdrop-blur-xs drop-shadow-xs">
                    ✓ {activeSlideData.stat}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Boutons de navigation du carrousel */}
            <div className="mt-6 sm:mt-8 flex items-center justify-center gap-4">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white border border-white/30 backdrop-blur-md shadow-sm transition-all cursor-pointer hover:scale-105"
                aria-label="Diapositive précédente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${currentSlide === idx ? 'w-8 bg-[#C59B27]' : 'w-2.5 bg-white/60 hover:bg-white'
                      }`}
                    aria-label={`Aller au slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white border border-white/30 backdrop-blur-md shadow-sm transition-all cursor-pointer hover:scale-105"
                aria-label="Diapositive suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* 4. TRIADE DES ACCÈS SÉCURISÉS (DÉGRADÉ BLANC & JAUNE OR) */}
        <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FFFDF9] via-[#FEFBF2] to-[#FFFDF9] border-b border-amber-200/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A1B29] bg-[#FDF2F4] px-3.5 py-1 rounded-full border border-[#FBCFE8]">
                Portails d'accès dédiés
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2.5">
                Choisissez votre espace de travail
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Carte 1 : Espace étudiant */}
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="h-full flex flex-col justify-between border-2 hover:border-[#7A1B29] transition-all p-7 bg-white shadow-sm rounded-2xl">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#FEF9EB] text-[#C59B27] border border-[#FDE68A] flex items-center justify-center mb-5">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                      Portail apprenant
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">Espace étudiant</h3>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      Accès simplifié sans mot de passe complexe : saisissez uniquement votre <strong>matricule étudiant</strong> pour
                      composer vos devoirs, consulter vos notes et télécharger vos bulletins officiels.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Button
                      variant="primary"
                      className="w-full justify-between"
                      onClick={() => onNavigateLogin('STUDENT')}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      <span>Accès étudiant (Matricule)</span>
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Carte 2 : Espace enseignant */}
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="h-full flex flex-col justify-between border-2 hover:border-slate-400 transition-all p-7 bg-white shadow-sm rounded-2xl">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#7A1B29] border border-slate-200 flex items-center justify-center mb-5">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Corps professoral
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">Espace enseignant</h3>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      Concevez vos fiches d'évaluation (QCM, questions ouvertes), saisissez les notes de vos classes
                      attribuées et enregistrez vos appréciations disciplinaires officielles.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Button
                      variant="outline"
                      className="w-full justify-between hover:bg-slate-50 text-slate-900"
                      onClick={() => onNavigateLogin('TEACHER')}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      <span>Accès formateur</span>
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Carte 3 : Espace administrateur */}
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="h-full flex flex-col justify-between border-2 hover:border-[#7A1B29] transition-all p-7 bg-white shadow-sm rounded-2xl">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#FDF2F4] text-[#7A1B29] border border-[#FBCFE8] flex items-center justify-center mb-5">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#7A1B29]">
                      Centre de pilotage
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">Administration centrale</h3>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      Pilotage financier (scolarité, encaissements, reçus numérotés), gestion des candidatures non affectés,
                      revue anti-triche et validation des bulletins officiels d'État.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Button
                      variant="outline"
                      className="w-full justify-between hover:bg-slate-50 text-slate-900"
                      onClick={() => onNavigateLogin('ADMIN')}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      <span>Accès direction et scolarité</span>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. PRÉSENTATION RÉALISTE DE LA STRUCTURE (DÉGRADÉ BLANC & JAUNE OR) */}
        <section className="py-20 bg-gradient-to-b from-[#FFFDF9] via-white to-[#FEFBF2] border-b border-amber-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Colonne texte institutionnel */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF9EB] text-[#B45309] border border-[#FDE68A] text-xs font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>Grand-Lahou • Région des Grands Ponts</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Un cadre d'excellence pédagogique au service de l'insertion
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Fondé avec l'ambition de répondre aux besoins critiques en compétences paramédicales et tertiaires en Côte d'Ivoire,
                  le <strong>cabinet Johmann Formation</strong> est officiellement agréé par le Ministère de l’Enseignement Technique,
                  de la Formation Professionnelle et de l’Apprentissage (METFPA) sous la décision <strong>N° 2012-1425 / METFP / CAB / DEP</strong>.
                </p>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Implanté au cœur de Grand-Lahou, notre établissement dispose de plateaux techniques modernes :
                  salles de simulation clinique, officines d'application, et laboratoires informatiques connectés,
                  garantissant une employabilité immédiate dès l'obtention du diplôme.
                </p>

                {/* Métriques clés */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-white border border-amber-200/60 shadow-xs text-center">
                    <span className="font-mono text-2xl font-black text-[#7A1B29] block">98%</span>
                    <span className="text-[11px] text-slate-500 font-medium">Taux d'insertion</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-amber-200/60 shadow-xs text-center">
                    <span className="font-mono text-2xl font-black text-[#C59B27] block">+1200</span>
                    <span className="text-[11px] text-slate-500 font-medium">Lauréats formés</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-amber-200/60 shadow-xs text-center">
                    <span className="font-mono text-2xl font-black text-emerald-700 block">24</span>
                    <span className="text-[11px] text-slate-500 font-medium">Cliniques partenaires</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-4 h-4 text-[#7A1B29] shrink-0" />
                  <span>Quartier populaire derrière le stade au sein de l'Établissement EL ITRATOU TAHIRA, Grand-Lahou</span>
                </div>
              </motion.div>

              {/* Colonne visuelle avec photos d'illustration concrètes */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden border border-amber-200/60 shadow-md h-52 sm:h-64 group relative">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEICBaGJK_65wjYxvKxJ0xrSYjdY3pCTR00t3xBlveI01Rhv-koOg8i6w&s=10"
                      alt="Salle de cours Johmann Formation"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-semibold">Enseignement interactif</span>
                    </div>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-amber-200/60 shadow-md h-36 sm:h-44 group relative">
                    <img
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80"
                      alt="Atelier pratique médical"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-semibold">Plateau technique médical</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="rounded-2xl overflow-hidden border border-amber-200/60 shadow-md h-36 sm:h-44 group relative">
                    <img
                      src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1000&auto=format&fit=crop&q=80"
                      alt="Laboratoire et officine témoin"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-semibold">Officine témoin</span>
                    </div>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-amber-200/60 shadow-md h-52 sm:h-64 group relative">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnzQm43uvPuP6lk_42NMrNRbZGWYH94LRR222ZS-Qswdn6HyXuSGLnB7eB&s=10"
                      alt="Vie de campus et collaboration"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-semibold">Encadrement de proximité</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 6. NOS FILIÈRES DE FORMATION AGRÉÉES (DÉGRADÉ BLANC & JAUNE OR) */}
        <section className="py-20 bg-gradient-to-b from-[#FEFBF2] via-[#FFFDF9] to-white border-b border-amber-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27] bg-[#FEF9EB] px-3.5 py-1 rounded-full border border-[#FDE68A]">
                Parcours diplômants homologués
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
                Nos filières de formation agréées
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Programmes structurés conformes aux exigences du Ministère pour propulser rapidement votre carrière.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Filière 1 : Aide-soignante */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-amber-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80"
                      alt="Formation aide-soignante"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#7A1B29] text-white shadow-sm">
                        Santé et clinique
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <Stethoscope className="w-4 h-4 text-[#7A1B29]" />
                      <span>Diplôme d’État • 2 semestres</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Aide-soignante</h3>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      Acquérez les compétences indispensables en soins infirmiers fondamentaux, hygiène hospitalière,
                      gynéco-obstétrique, pédiatrie et premiers secours d'urgence.
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Stages pratiques en CHU et hôpitaux</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Attestation de secourisme d'urgence</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Button
                    variant="outline"
                    className="w-full justify-between group-hover:bg-[#7A1B29] group-hover:text-white transition-colors"
                    onClick={() => setIsRegistrationModalOpen(true)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    <span>S'inscrire à cette filière</span>
                  </Button>
                </div>
              </motion.div>

              {/* Filière 2 : Auxiliaire en pharmacie */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white border border-amber-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&auto=format&fit=crop&q=80"
                      alt="Formation auxiliaire en pharmacie"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#C59B27] text-white shadow-sm">
                        Officine et médicaments
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <Pill className="w-4 h-4 text-[#C59B27]" />
                      <span>Diplôme d’État • 2 semestres</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Auxiliaire en pharmacie</h3>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      Maîtrisez la dispensation des ordonnances, la classification pharmacologique, la gestion rigoureuse
                      des stocks de médicaments et l’accueil des patients au comptoir.
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pratique en pharmacie partenaire</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Logiciels officinaux certifiés</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Button
                    variant="outline"
                    className="w-full justify-between group-hover:bg-[#7A1B29] group-hover:text-white transition-colors"
                    onClick={() => setIsRegistrationModalOpen(true)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    <span>S'inscrire à cette filière</span>
                  </Button>
                </div>
              </motion.div>

              {/* Filière 3 : Caissière spécialisée */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white border border-amber-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&auto=format&fit=crop&q=80"
                      alt="Formation caissière spécialisée"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-white shadow-sm">
                        Commerce et finance
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <Calculator className="w-4 h-4 text-slate-700" />
                      <span>Diplôme d’État • 2 semestres</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Caissière spécialisée</h3>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      Devenez experte dans la tenue de caisse informatisée, l’encaissement multi-moyens (Mobile Money, cartes, espèces),
                      l’accueil client d'excellence et la réconciliation financière.
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Terminaux électroniques modernes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Détection de fausse monnaie</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Button
                    variant="outline"
                    className="w-full justify-between group-hover:bg-[#7A1B29] group-hover:text-white transition-colors"
                    onClick={() => setIsRegistrationModalOpen(true)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    <span>S'inscrire à cette filière</span>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 7. ACTIVITÉS DE LA STRUCTURE (DÉGRADÉ BLANC & JAUNE OR) */}
        <section className="py-20 bg-gradient-to-b from-white via-[#FFFDF9] to-[#FEFBF2] border-b border-amber-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A1B29] bg-[#FDF2F4] px-3.5 py-1 rounded-full border border-[#FBCFE8]">
                Vie académique et professionnelle
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
                Les activités au cœur de notre formation
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Un apprentissage vivant et ancré dans le réel à travers des expériences terrain régulières.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ACTIVITIES.map((act, index) => (
                <motion.div
                  key={act.titre}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border border-amber-200/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={act.image}
                        alt={act.titre}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-slate-800 shadow-xs">
                        {act.badge}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-1 text-[11px] font-mono text-[#C59B27] font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{act.frequence}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{act.titre}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <span className="text-[11px] font-semibold text-[#7A1B29] flex items-center gap-1">
                      <span>Johmann excellence</span>
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. MEMBRES DE L'ÉQUIPE PÉDAGOGIQUE & DIRECTION (DÉGRADÉ BLANC & JAUNE OR) */}
        <section className="py-20 bg-gradient-to-b from-[#FEFBF2] via-[#FFFDF9] to-[#FFFDF9] border-b border-amber-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27] bg-[#FEF9EB] px-3.5 py-1 rounded-full border border-[#FDE68A]">
                Corps professoral et encadrement
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
                Une équipe pédagogique dévouée et certifiée
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Des professionnels aguerris du secteur médical, officinal et juridique pour vous guider vers la réussite.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEAM_MEMBERS.map((member, index) => (
                <motion.div
                  key={member.nom}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="p-5 rounded-2xl border border-amber-200/60 bg-white hover:border-[#7A1B29]/40 hover:shadow-md transition-all flex items-start gap-4"
                >
                  <img
                    src={member.photo}
                    alt={member.nom}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                  />
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{member.nom}</h4>
                    <span className="text-xs font-semibold text-[#7A1B29] block">{member.role}</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">{member.description}</p>
                    <span className="inline-block text-[10px] font-mono font-medium text-slate-500 pt-1">
                      Spécialité : {member.specialite}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 9. Footer institutionnel complet */}
      <footer className="bg-[#FFFDF9] border-t border-amber-200/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-amber-100">
            <div>
              <HeaderBrand taille="sm" />
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                Plateforme officielle de gestion académique, des compositions surveillées en ligne et des bulletins de notes
                certifiés de Johmann Formation à Grand-Lahou.
              </p>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5">
              <span className="font-bold text-slate-900 text-xs block uppercase tracking-wider mb-2">Agrément ministériel</span>
              <p>Cabinet de formation agréé par l'État à Grand-Lahou</p>
              <p>Décision N° 2012-1425 / METFP / CAB / DEP</p>
              <p>Quartier populaire derrière le stade au sein de l'Établissement EL ITRATOU TAHIRA</p>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5">
              <span className="font-bold text-slate-900 text-xs block uppercase tracking-wider mb-2">Assistance et contacts</span>
              <p className="font-mono text-[#7A1B29] font-bold">07 59 56 11 50 / 07 08 37 01 01</p>
              <p className="font-mono text-slate-700">01 40 07 15 08 / 01 03 33 81 33</p>
              <p className="text-slate-500 pt-1">Email : contact@johmann.edu.ci</p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <p>© {new Date().getFullYear()} Johmann Formation. Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <span>Grand-Lahou, République de Côte d'Ivoire</span>
              <span>•</span>
              <span className="font-mono"> L'excellence notre priorité</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal officiel de demande d'inscription pour candidats non affectés */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  )
}

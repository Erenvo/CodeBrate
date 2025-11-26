import React from 'react'
import Navbar from '@/app/components/common/Navbar'
import HeroSection from '@/app/components/home/HeroSection'
import FeaturesSection from '@/app/components/home/FeaturesSection'
import ProjectsSection from '@/app/components/home/ProjectsSection'
import TalentPoolSection from '@/app/components/home/TalentPoolSection'
import CtaSection from '@/app/components/home/CtaSection'

// Örnek proje verisi (tasarım dosyasından)
const sampleProjects = [
  {
    id: '1',
    title: 'Akıllı Ders Notu Sistemi',
    summary: 'Öğrenciler için otomatik not özetleme ve çalışma planı.',
    tags: ['Python', 'NLP'],
    owner: 'Bilkent',
  },
  {
    id: '2',
    title: 'Kampüs Etkinlik Haritası',
    summary: 'Üniversite etkinliklerini görsel olarak keşfet.',
    tags: ['React', 'Map'],
    owner: 'İTÜ',
  },
  {
    id: '3',
    title: 'Portfolyo Otomasyon Aracı',
    summary: 'GitHub reposunu CV formatına çeviren araç.',
    tags: ['Node', 'Frontend'],
    owner: 'ODTÜ',
  },
]

export default function LandingPage() {
  return (
    // <main> etiketi ile başlıyor, Navbar ve Footer layout'tan gelecek
    <main>
      <HeroSection projects={sampleProjects} />
      <FeaturesSection />
      <ProjectsSection projects={sampleProjects} />
      <TalentPoolSection />
      <CtaSection />
    </main>
  )
}
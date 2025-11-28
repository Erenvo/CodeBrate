// app/components/home/TalentPoolSection.tsx
import React from 'react'
import Link from 'next/link'

// Örnek veriler
const sampleTalents = [
  {
    id: 'user-uuid-1', // Buraya veritabanından gerçek bir ID yazarsan profil açılır
    name: 'Eren A.',
    role: 'React • TypeScript • ML',
    desc: 'Proje fikirlerini geliştirmeye açığım. Haftada 8-10 saat ayırabilirim.',
    initials: 'EA',
    color: 'bg-indigo-700'
  },
  {
    id: 'user-uuid-2',
    name: 'Y. Koray',
    role: 'UI/UX • Figma',
    desc: 'Tasarım odaklı projelere açığım. Portfolio: behance.net/koray',
    initials: 'YK',
    color: 'bg-pink-700'
  },
  {
    id: 'user-uuid-3',
    name: 'Zeynep T.',
    role: 'Node.js • Backend',
    desc: 'Büyük ölçekli veri tabanı projelerinde yer almak istiyorum.',
    initials: 'ZT',
    color: 'bg-green-700'
  }
]

// DİKKAT: Burada 'export default' yazması şart!
export default function TalentPoolSection() {
  return (
    <section
      id="yetenekler"
      className="mx-auto max-w-6xl px-6 py-16 border-t border-gray-800"
    >
      <h3 className="text-2xl font-semibold text-white mb-6">Yetenek Havuzu</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleTalents.map((talent) => (
          <div key={talent.id} className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full ${talent.color} flex items-center justify-center text-white`}>
                {talent.initials}
              </div>
              <div>
                <h4 className="font-semibold text-white">{talent.name}</h4>
                <p className="text-xs text-gray-400">{talent.role}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-300">
              {talent.desc}
            </p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-md border border-indigo-500 px-3 py-1 text-sm text-indigo-400 hover:bg-gray-700">
                İletişime Geç
              </button>
              
              {/* Profil Linki */}
              <Link 
                href={`/profil/${talent.id}`} 
                className="rounded-md border border-gray-700 px-3 py-1 text-sm hover:bg-gray-700 text-gray-300 flex items-center justify-center"
              >
                Profili Gör
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
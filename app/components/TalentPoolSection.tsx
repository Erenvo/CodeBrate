import React from 'react'

export default function TalentPoolSection() {
  return (
    <section
      id="yetenekler"
      className="mx-auto max-w-6xl px-6 py-16 border-t border-gray-800"
    >
      <h3 className="text-2xl font-semibold text-white mb-6">Yetenek Havuzu</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Örnek Yetenek Kartı 1 */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center text-white">
              EA
            </div>
            <div>
              <h4 className="font-semibold text-white">Eren A.</h4>
              <p className="text-xs text-gray-400">React • TypeScript • ML</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-300">
            Proje fikirlerini geliştirmeye açığım. Haftada 8-10 saat
            ayırabilirim.
          </p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-md border border-indigo-500 px-3 py-1 text-sm text-indigo-400 hover:bg-gray-700">
              İletişime Geç
            </button>
            <button className="rounded-md border border-gray-700 px-3 py-1 text-sm hover:bg-gray-700">
              Profili Gör
            </button>
          </div>
        </div>
        {/* Örnek Yetenek Kartı 2 */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-pink-700 flex items-center justify-center text-white">
              YK
            </div>
            <div>
              <h4 className="font-semibold text-white">Y. Koray</h4>
              <p className="text-xs text-gray-400">UI/UX • Figma</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-300">
            Tasarım odaklı projelere açığım. Portfolio: behance.net/koray
          </p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-md border border-indigo-500 px-3 py-1 text-sm text-indigo-400 hover:bg-gray-700">
              İletişime Geç
            </button>
            <button className="rounded-md border border-gray-700 px-3 py-1 text-sm hover:bg-gray-700">
              Profili Gör
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
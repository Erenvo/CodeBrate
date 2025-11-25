import React from 'react'
import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 border-t border-gray-800">
      <div className="rounded-2xl bg-indigo-700/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-semibold text-white">
            Takımını kurmaya hazır mısın?
          </h3>
          <p className="mt-2 text-gray-400">
            Hemen kaydol, profilini oluştur ve proje ilanını paylaş. Onay
            sonrası detayları kontrol et.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/register"
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:opacity-90"
          >
            Kaydol
          </Link>
          <button className="rounded-md border border-gray-700 px-4 py-2 text-gray-300 hover:bg-gray-800">
            Daha Fazla Bilgi
          </button>
        </div>
      </div>
    </section>
  )
}
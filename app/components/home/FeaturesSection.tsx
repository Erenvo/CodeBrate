import React from 'react'
import { Grid, User, MessageSquare } from 'lucide-react'

export default function FeaturesSection() {
  return (
    <section
      id="nasilcalisir"
      className="mx-auto max-w-6xl px-6 py-16 border-t border-gray-800"
    >
      <h3 className="text-2xl font-semibold text-white">Nasıl çalışır?</h3>
      <p className="mt-2 text-gray-400">
        Kayıt ol (üniversite e-postası) → Profil oluştur → Proje yayınla
        (Vitrin) → Başvuruları değerlendir → Kasa'yı aç.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
          <div className="flex items-start gap-4">
            <div className="rounded-md bg-indigo-900 p-3 text-indigo-300 shrink-0">
              <Grid size={20} />
            </div>
            <div>
              <h4 className="font-medium text-white">Vitrin & Kasa</h4>
              <p className="text-sm text-gray-400">
                Proje özetini herkese açık paylaş, detayları yalnızca onaylı
                kişilere göster.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
          <div className="flex items-start gap-4">
            <div className="rounded-md bg-indigo-900 p-3 text-indigo-300 shrink-0">
              <User size={20} />
            </div>
            <div>
              <h4 className="font-medium text-white">Üniversite Doğrulama</h4>
              <p className="text-sm text-gray-400">
                Sadece @edu.tr e-postası ile kayıt. Güvenli topluluk.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
          <div className="flex items-start gap-4">
            <div className="rounded-md bg-indigo-900 p-3 text-indigo-300 shrink-0">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="font-medium text-white">Başvuru & İletişim</h4>
              <p className="text-sm text-gray-400">
                Projeye başvur, onay sonrası iletişime geç.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
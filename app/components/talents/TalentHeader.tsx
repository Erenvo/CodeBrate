// app/components/talents/TalentHeader.tsx
'use client'
import { Search } from 'lucide-react'

type Props = {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

// 👇 BU "export default" İFADESİ ÇOK ÖNEMLİ
export function TalentHeader({ searchTerm, setSearchTerm }: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
      <div>
        <h1 className="text-3xl font-bold text-white">Yetenek Havuzu</h1>
        <p className="text-gray-400 mt-2">Projelerin için en doğru ekip arkadaşlarını keşfet.</p>
      </div>
      
      <div className="w-full md:w-96 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input 
          type="text" 
          placeholder="İsim veya yetenek ara (örn: React)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-500"
        />
      </div>
    </div>
  )
}
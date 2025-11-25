import React from 'react'

type Project = {
  id: string
  title: string
  summary: string
  tags: string[]
  owner: string
}

interface ProjectsSectionProps {
  projects: Project[]
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section
      id="projeler"
      className="mx-auto max-w-6xl px-6 py-16 border-t border-gray-800"
    >
      <h3 className="text-2xl font-semibold text-white mb-6">Proje Pazarı</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <article
            key={p.id}
            className="rounded-xl border border-gray-700 bg-gray-800 p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {p.title}
                </h4>
                <p className="mt-1 text-sm text-gray-400">
                  {p.owner} · {p.tags.join(' • ')}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-300">{p.summary}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <button className="rounded-md border border-indigo-500 px-3 py-1 text-sm text-indigo-400 hover:bg-gray-700">
                İlgileniyorum
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
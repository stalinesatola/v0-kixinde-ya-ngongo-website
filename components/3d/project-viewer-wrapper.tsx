'use client'

import dynamic from 'next/dynamic'
import React from 'react'
import type { Project } from '@/lib/types'

const ProjectViewer3DDynamic = dynamic(
  () => import('./project-viewer-3d').then(mod => ({ default: mod.ProjectViewer3D })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-sans">Carregando visualização 3D...</p>
      </div>
    ),
  }
)

export function Project3DViewerWrapper({ projectData }: { projectData: Partial<Project> }) {
  return <ProjectViewer3DDynamic projectData={projectData} />
}

'use client'

import React, { useState, Suspense } from 'react'
import { SceneViewer } from './scene-viewer'
import { BuildingModel } from './building-model'
import { FloorPlan } from './floor-plan'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, LayoutGrid, Layers } from 'lucide-react'
import { SectionsElevations } from './sections-elevations'
import { BIMStructure } from './bim-structure'
import type { Project } from '@/lib/types'

interface ProjectViewer3DProps {
  projectData: Partial<Project>
}

interface ViewerState {
  mepEnabled: {
    mechanical: boolean
    electrical: boolean
    plumbing: boolean
  }
}

function LoadingFallback() {
  return (
    <div className="w-full h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground font-sans">Carregando visualização 3D...</p>
    </div>
  )
}

export function ProjectViewer3D({ projectData }: ProjectViewer3DProps) {
  const [selectedFloor, setSelectedFloor] = useState(0)
  const [mepEnabled, setMepEnabled] = useState({
    mechanical: true,
    electrical: true,
    plumbing: true,
  })
  const floors = projectData.floors || 1

  return (
    <div className="w-full h-screen bg-background">
      <Tabs defaultValue="volumetry" className="w-full h-full flex flex-col">
        <TabsList className="border-b border-border rounded-none bg-secondary w-full justify-start">
          <TabsTrigger value="volumetry" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Volumetria 3D
          </TabsTrigger>
          <TabsTrigger value="floorplan" className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            Planta Baixa
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Cortes e Alçados
          </TabsTrigger>
          <TabsTrigger value="bim" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Estrutura BIM
          </TabsTrigger>
        </TabsList>

        {/* Volumetria 3D */}
        <TabsContent value="volumetry" className="flex-1 p-0">
          <Suspense fallback={<LoadingFallback />}>
            <SceneViewer
              cameraPosition={[15, 12, 15]}
              showGrid={true}
              showAxes={false}
              environmentPreset="studio"
            >
              <BuildingModel projectData={projectData} />
            </SceneViewer>
          </Suspense>
        </TabsContent>

        {/* Planta Baixa */}
        <TabsContent value="floorplan" className="flex-1 flex flex-col p-0">
          <div className="flex-1">
            <Suspense fallback={<LoadingFallback />}>
              <SceneViewer
                cameraPosition={[0, 20, 0]}
                showGrid={true}
                showAxes={true}
                environmentPreset="studio"
              >
                <FloorPlan projectData={projectData} floorIndex={selectedFloor} />
                {/* Adicionar dimensões e anotações */}
                <group>
                  {/* Dimensões serão adicionadas aqui */}
                </group>
              </SceneViewer>
            </Suspense>
          </div>

          {/* Seletor de piso */}
          {floors > 1 && (
            <div className="border-t border-border bg-secondary p-4 flex gap-2">
              <span className="text-sm text-muted-foreground font-sans">Piso:</span>
              <div className="flex gap-2">
                {Array.from({ length: floors }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedFloor(i)}
                    className={`px-3 py-1 rounded text-sm font-sans transition-colors ${
                      selectedFloor === i
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-background text-foreground hover:bg-secondary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Cortes e Alçados */}
        <TabsContent value="sections" className="flex-1 flex flex-col p-0">
          <Suspense fallback={<LoadingFallback />}>
            <SceneViewer
              cameraPosition={[0, 8, 12]}
              showGrid={true}
              showAxes={true}
              environmentPreset="studio"
            >
              <SectionsElevations projectData={projectData} viewType="section" />
            </SceneViewer>
          </Suspense>
          
          {/* Botões de visualização */}
          <div className="border-t border-border bg-secondary p-4 flex gap-2 flex-wrap">
            <label className="flex items-center gap-2 text-sm font-sans cursor-pointer">
              <input
                type="checkbox"
                checked={mepEnabled.mechanical}
                onChange={(e) => setMepEnabled({ ...mepEnabled, mechanical: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Ar Condicionado</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-sans cursor-pointer">
              <input
                type="checkbox"
                checked={mepEnabled.electrical}
                onChange={(e) => setMepEnabled({ ...mepEnabled, electrical: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Sistema Elétrico</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-sans cursor-pointer">
              <input
                type="checkbox"
                checked={mepEnabled.plumbing}
                onChange={(e) => setMepEnabled({ ...mepEnabled, plumbing: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Hidráulica</span>
            </label>
          </div>
        </TabsContent>

        {/* Estrutura BIM */}
        <TabsContent value="bim" className="flex-1 p-0">
          <Suspense fallback={<LoadingFallback />}>
            <SceneViewer
              cameraPosition={[15, 12, 15]}
              showGrid={true}
              showAxes={false}
              environmentPreset="studio"
            >
              <BIMStructure projectData={projectData} showMEP={mepEnabled} />
            </SceneViewer>
          </Suspense>

          {/* Controles BIM */}
          <div className="border-t border-border bg-secondary p-4 flex gap-2 flex-wrap">
            <label className="flex items-center gap-2 text-sm font-sans cursor-pointer">
              <input
                type="checkbox"
                checked={mepEnabled.mechanical}
                onChange={(e) => setMepEnabled({ ...mepEnabled, mechanical: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Mecânico (HVAC)</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-sans cursor-pointer">
              <input
                type="checkbox"
                checked={mepEnabled.electrical}
                onChange={(e) => setMepEnabled({ ...mepEnabled, electrical: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Elétrico</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-sans cursor-pointer">
              <input
                type="checkbox"
                checked={mepEnabled.plumbing}
                onChange={(e) => setMepEnabled({ ...mepEnabled, plumbing: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Hidráulico</span>
            </label>
          </div>
        </TabsContent>

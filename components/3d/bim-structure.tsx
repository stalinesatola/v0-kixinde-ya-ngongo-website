'use client'

import React, { useMemo } from 'react'
import * as THREE from 'three'
import type { Project } from '@/lib/types'

interface BIMStructureProps {
  projectData: Partial<Project>
  showMEP?: {
    mechanical?: boolean
    electrical?: boolean
    plumbing?: boolean
  }
}

export function BIMStructure({ projectData, showMEP = { mechanical: true, electrical: true, plumbing: true } }: BIMStructureProps) {
  const bimGeometry = useMemo(() => {
    const width = Math.max(projectData.area ? Math.sqrt(projectData.area) * 0.8 : 10, 5)
    const depth = Math.max(projectData.area ? Math.sqrt(projectData.area) * 0.6 : 8, 5)
    const floors = Math.max(projectData.floors || 1, 1)
    const floorHeight = 3.5

    const bimGroup = new THREE.Group()

    // Estrutura de Concreto
    const columnRadius = 0.3
    const columnGeometry = new THREE.CylinderGeometry(columnRadius, columnRadius, floorHeight * floors, 16)
    const columnMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 })

    // Colunas nos 4 cantos
    const columnPositions = [
      [-width / 2 + 1, 0, -depth / 2 + 1],
      [width / 2 - 1, 0, -depth / 2 + 1],
      [-width / 2 + 1, 0, depth / 2 - 1],
      [width / 2 - 1, 0, depth / 2 - 1],
    ]

    columnPositions.forEach(([x, y, z]) => {
      const column = new THREE.Mesh(columnGeometry, columnMaterial)
      column.position.set(x, y + floorHeight * floors / 2, z)
      column.castShadow = true
      column.receiveShadow = true
      bimGroup.add(column)
    })

    // Vigas
    const beamHeight = 0.4
    const beamGeometry = new THREE.BoxGeometry(width - 2, beamHeight, depth - 2)
    const beamMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 })

    for (let floor = 1; floor <= floors; floor++) {
      const beam = new THREE.Mesh(beamGeometry, beamMaterial)
      beam.position.y = floor * floorHeight - beamHeight / 2
      beam.castShadow = true
      beam.receiveShadow = true
      bimGroup.add(beam)
    }

    // Sistema de Ar Condicionado (Mechanical)
    if (showMEP.mechanical) {
      const acGeometry = new THREE.BoxGeometry(1.5, 0.5, 1)
      const acMaterial = new THREE.MeshPhongMaterial({ color: 0x00aa00 })

      for (let floor = 0; floor < floors; floor++) {
        const ac = new THREE.Mesh(acGeometry, acMaterial)
        ac.position.set(width / 2 - 1.5, floor * floorHeight + 3, depth / 2 - 1)
        ac.castShadow = true
        bimGroup.add(ac)
      }
    }

    // Sistema Elétrico (Electrical)
    if (showMEP.electrical) {
      const wireColor = 0xff9900
      const wireMaterial = new THREE.LineBasicMaterial({ color: wireColor, linewidth: 2 })

      // Cabeamento horizontal
      for (let floor = 0; floor < floors; floor++) {
        const y = floor * floorHeight + 2.8

        const wirePoints = [
          new THREE.Vector3(-width / 2 + 1, y, 0),
          new THREE.Vector3(width / 2 - 1, y, 0),
        ]

        const wireGeometry = new THREE.BufferGeometry().setFromPoints(wirePoints)
        const wire = new THREE.LineSegments(wireGeometry, wireMaterial)
        bimGroup.add(wire)

        // Caixas de distribuição
        const boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)
        const boxMaterial = new THREE.MeshPhongMaterial({ color: wireColor })
        const box = new THREE.Mesh(boxGeometry, boxMaterial)
        box.position.set(width / 2 - 2, y, 0)
        bimGroup.add(box)
      }
    }

    // Sistema Hidráulico/Plumbing
    if (showMEP.plumbing) {
      const pipeColor = 0x0099ff
      const pipeMaterial = new THREE.LineBasicMaterial({ color: pipeColor, linewidth: 3 })

      // Tubenagens verticais
      for (let i = 0; i < 2; i++) {
        const x = -width / 2 + 2 + i * (width - 4)
        const pipePoints = [
          new THREE.Vector3(x, 0, depth / 2 - 1.5),
          new THREE.Vector3(x, floorHeight * floors, depth / 2 - 1.5),
        ]

        const pipeGeometry = new THREE.BufferGeometry().setFromPoints(pipePoints)
        const pipe = new THREE.LineSegments(pipeGeometry, pipeMaterial)
        bimGroup.add(pipe)
      }
    }

    return bimGroup
  }, [projectData.area, projectData.floors, showMEP])

  return <primitive object={bimGeometry} />
}

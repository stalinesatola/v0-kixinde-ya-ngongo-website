'use client'

import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import type { Project } from '@/lib/types'

interface SectionsElevationsProps {
  projectData: Partial<Project>
  viewType?: 'section' | 'elevation'
}

export function SectionsElevations({ projectData, viewType = 'section' }: SectionsElevationsProps) {
  const geometry = useMemo(() => {
    const width = Math.max(projectData.area ? Math.sqrt(projectData.area) * 0.8 : 10, 5)
    const depth = Math.max(projectData.area ? Math.sqrt(projectData.area) * 0.6 : 8, 5)
    const floors = Math.max(projectData.floors || 1, 1)
    const floorHeight = 3.5
    const totalHeight = floors * floorHeight

    const group = new THREE.Group()

    if (viewType === 'section') {
      // Seção transversal (cortante)
      const lineColor = 0x000000
      const lineMaterial = new THREE.LineBasicMaterial({ color: lineColor, linewidth: 2 })

      // Desenhar linhas de construção
      const points: THREE.Vector3[] = []

      // Base
      points.push(new THREE.Vector3(-width / 2, 0, 0))
      points.push(new THREE.Vector3(width / 2, 0, 0))

      // Lado esquerdo
      points.push(new THREE.Vector3(-width / 2, 0, 0))
      points.push(new THREE.Vector3(-width / 2, totalHeight, 0))

      // Lado direito
      points.push(new THREE.Vector3(width / 2, 0, 0))
      points.push(new THREE.Vector3(width / 2, totalHeight, 0))

      // Topo (telhado)
      points.push(new THREE.Vector3(-width / 2 + width * 0.15, totalHeight, 0))
      points.push(new THREE.Vector3(0, totalHeight + floorHeight * 0.3, 0))
      points.push(new THREE.Vector3(width / 2 - width * 0.15, totalHeight, 0))

      // Linhas de pisos
      for (let floor = 1; floor < floors; floor++) {
        const floorY = floor * floorHeight
        points.push(new THREE.Vector3(-width / 2, floorY, 0))
        points.push(new THREE.Vector3(width / 2, floorY, 0))
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const lines = new THREE.LineSegments(geometry, lineMaterial)
      group.add(lines)

      // Adicionar dimensões de altura
      for (let floor = 0; floor <= floors; floor++) {
        const y = floor * floorHeight
        const dimensionMesh = createDimensionLabel(
          `${(floorHeight * 100).toFixed(0)} cm`,
          -width / 2 - 2,
          y + floorHeight / 2,
          0.5
        )
        group.add(dimensionMesh)
      }

      // Dimensão de largura
      const widthLabel = createDimensionLabel(`${width.toFixed(2)} m`, 0, -1, 0.5)
      group.add(widthLabel)
    } else {
      // Alçado frontal
      const facadeGeometry = new THREE.BoxGeometry(width, totalHeight, 0.2)
      const facadeMaterial = new THREE.MeshPhongMaterial({ color: 0xd4a574 })
      const facade = new THREE.Mesh(facadeGeometry, facadeMaterial)
      group.add(facade)

      // Janelas no alçado
      const windowSize = 1.0
      const windowSpacing = 2.5
      const windowsPerFloor = Math.floor(width / windowSpacing)

      for (let floor = 0; floor < floors; floor++) {
        for (let w = 0; w < windowsPerFloor; w++) {
          const x = -width / 2 + windowSpacing * (w + 0.5)
          const y = floor * floorHeight + floorHeight / 2

          const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize)
          const windowMaterial = new THREE.MeshPhongMaterial({ color: 0x87ceeb })
          const window = new THREE.Mesh(windowGeometry, windowMaterial)
          window.position.set(x, y, 0.11)
          group.add(window)
        }
      }

      // Dimensão de altura total
      const heightLabel = createDimensionLabel(`${(totalHeight * 100).toFixed(0)} cm`, width / 2 + 1, totalHeight / 2, 0.5)
      group.add(heightLabel)

      // Dimensão de largura
      const widthLabel = createDimensionLabel(`${width.toFixed(2)} m`, 0, -1, 0.5)
      group.add(widthLabel)
    }

    return group
  }, [projectData.area, projectData.floors, viewType])

  return <primitive object={geometry} />
}

function createDimensionLabel(text: string, x: number, y: number, scale: number): THREE.Group {
  const group = new THREE.Group()

  // Linha de dimensão
  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array([x, y, 0, x, y + 0.5, 0]), 3)
  )
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x666666 })
  const line = new THREE.LineSegments(lineGeometry, lineMaterial)
  group.add(line)

  // Canvas com texto
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#333333'
    ctx.font = '24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(text, 128, 40)
  }

  const texture = new THREE.CanvasTexture(canvas)
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.position.set(x, y + 1, 0.01)
  sprite.scale.set(2, 0.5, 1)
  group.add(sprite)

  return group
}

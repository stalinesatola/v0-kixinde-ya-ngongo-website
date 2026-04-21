'use client'

import React, { useMemo } from 'react'
import * as THREE from 'three'
import type { Project } from '@/lib/types'

interface BuildingModelProps {
  projectData: Partial<Project>
  showWireframe?: boolean
}

export function BuildingModel({ projectData, showWireframe = false }: BuildingModelProps) {
  const buildingGeometry = useMemo(() => {
    // Dimensões base do edifício
    const width = Math.max(projectData.area ? Math.sqrt(projectData.area) * 0.8 : 10, 5)
    const depth = Math.max(projectData.area ? Math.sqrt(projectData.area) * 0.6 : 8, 5)
    const floors = Math.max(projectData.floors || 1, 1)
    const floorHeight = 3.5

    const totalHeight = floors * floorHeight

    // Grupo que conterá todos os pisos
    const building = new THREE.Group()

    // Cor de base - tons de terra
    const wallColor = new THREE.Color(0xd4a574)
    const roofColor = new THREE.Color(0x8b4513)
    const windowColor = new THREE.Color(0x87ceeb)

    // Criar cada piso
    for (let floor = 0; floor < floors; floor++) {
      const floorY = floor * floorHeight

      // Paredes (caixa retangular para cada piso)
      const wallThickness = 0.3
      const wallGeometry = new THREE.BoxGeometry(width, floorHeight - 0.1, depth)
      const wallMaterial = new THREE.MeshPhongMaterial({
        color: wallColor,
        shininess: 30,
      })
      const walls = new THREE.Mesh(wallGeometry, wallMaterial)
      walls.position.y = floorY + floorHeight / 2
      walls.castShadow = true
      walls.receiveShadow = true
      building.add(walls)

      // Janelas (frontal)
      const windowSize = 1.2
      const windowSpacingX = 2.5
      const windowsPerFloor = Math.floor(width / windowSpacingX)

      for (let w = 0; w < windowsPerFloor; w++) {
        const xPos = (w - windowsPerFloor / 2) * windowSpacingX + windowSpacingX / 2
        const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize)
        const windowMaterial = new THREE.MeshPhongMaterial({
          color: windowColor,
          shininess: 100,
        })
        const window = new THREE.Mesh(windowGeometry, windowMaterial)
        window.position.set(xPos, floorY + floorHeight / 2, depth / 2 + 0.01)
        building.add(window)

        // Janelas traseiras
        const windowBack = window.clone()
        windowBack.position.z = -depth / 2 - 0.01
        building.add(windowBack)
      }

      // Lajes (pisos)
      if (floor < floors) {
        const floorGeometry = new THREE.BoxGeometry(width + 0.4, 0.2, depth + 0.4)
        const floorMaterial = new THREE.MeshPhongMaterial({
          color: 0x696969,
          shininess: 20,
        })
        const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)
        floorMesh.position.y = floorY + floorHeight
        floorMesh.castShadow = true
        floorMesh.receiveShadow = true
        building.add(floorMesh)
      }
    }

    // Telhado (pirâmide)
    const roofGeometry = new THREE.ConeGeometry(Math.max(width, depth) * 0.7, floorHeight * 0.6, 4)
    const roofMaterial = new THREE.MeshPhongMaterial({
      color: roofColor,
      shininess: 20,
    })
    const roof = new THREE.Mesh(roofGeometry, roofMaterial)
    roof.position.y = totalHeight
    roof.castShadow = true
    roof.receiveShadow = true
    roof.rotation.y = Math.PI / 4
    building.add(roof)

    return building
  }, [projectData.area, projectData.floors])

  return (
    <group>
      <primitive object={buildingGeometry} />

      {/* Solo base */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[50, 1, 50]} />
        <meshPhongMaterial color={0x90ee90} />
      </mesh>
    </group>
  )
}

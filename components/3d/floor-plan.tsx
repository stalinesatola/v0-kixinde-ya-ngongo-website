'use client'

import React, { useMemo } from 'react'
import * as THREE from 'three'
import type { Project } from '@/lib/types'

interface FloorPlanProps {
  projectData: Partial<Project>
  floorIndex?: number
}

export function FloorPlan({ projectData, floorIndex = 0 }: FloorPlanProps) {
  const planGeometry = useMemo(() => {
    const width = Math.max(projectData.area ? Math.sqrt(projectData.area) * 0.8 : 10, 5)
    const depth = Math.max(projectData.area ? Math.sqrt(projectData.area) * 0.6 : 8, 5)
    const bedrooms = projectData.bedrooms || 1
    const bathrooms = projectData.bathrooms || 1

    const plan = new THREE.Group()

    // Parede externa
    const wallThickness = 0.3
    const wallColor = 0x000000

    // Paredes perimetrais
    const wallGeometry = new THREE.BoxGeometry(width + wallThickness * 2, 0.1, wallThickness)
    const wallMaterial = new THREE.MeshPhongMaterial({ color: wallColor })

    // Frente
    const frontWall = new THREE.Mesh(wallGeometry, wallMaterial)
    frontWall.position.z = depth / 2
    plan.add(frontWall)

    // Trás
    const backWall = frontWall.clone()
    backWall.position.z = -depth / 2
    plan.add(backWall)

    // Laterais
    const sideWallGeometry = new THREE.BoxGeometry(wallThickness, 0.1, depth + wallThickness * 2)
    const sideWall1 = new THREE.Mesh(sideWallGeometry, wallMaterial)
    sideWall1.position.x = width / 2
    plan.add(sideWall1)

    const sideWall2 = sideWall1.clone()
    sideWall2.position.x = -width / 2
    plan.add(sideWall2)

    // Distribuir quartos
    const bedroomWidth = (width - wallThickness * 2) / Math.max(bedrooms, 1)
    const bedroomDepth = depth * 0.6

    for (let i = 0; i < bedrooms; i++) {
      const bedroomX = -width / 2 + wallThickness + bedroomWidth * (i + 0.5)
      const bedroomZ = depth / 2 - bedroomDepth - wallThickness

      // Paredes internas do quarto
      const roomWallThickness = 0.2
      const roomGeometry = new THREE.BoxGeometry(bedroomWidth - roomWallThickness, 0.1, bedroomDepth - roomWallThickness)
      const roomMaterial = new THREE.MeshPhongMaterial({ color: 0xeeeeee })
      const roomFloor = new THREE.Mesh(roomGeometry, roomMaterial)
      roomFloor.position.set(bedroomX, 0, bedroomZ - bedroomDepth / 2)
      plan.add(roomFloor)

      // Paredes do quarto
      if (i > 0) {
        const dividerGeometry = new THREE.BoxGeometry(roomWallThickness, 0.1, bedroomDepth)
        const divider = new THREE.Mesh(dividerGeometry, wallMaterial)
        divider.position.x = bedroomX - bedroomWidth / 2
        plan.add(divider)
      }
    }

    // Área de casas de banho
    const bathroomArea = (width - wallThickness * 2) * 0.2
    const bathroomGeometry = new THREE.BoxGeometry(bathroomArea, 0.1, depth * 0.2)
    const bathroomMaterial = new THREE.MeshPhongMaterial({ color: 0xb0e0e6 })

    for (let i = 0; i < bathrooms; i++) {
      const bathroom = new THREE.Mesh(bathroomGeometry, bathroomMaterial)
      bathroom.position.set(-width / 4 + i * width / 2, 0, -depth / 2 + depth * 0.1)
      plan.add(bathroom)
    }

    // Área de estar/cozinha
    const livingAreaGeometry = new THREE.BoxGeometry(width * 0.4, 0.1, depth * 0.3)
    const livingAreaMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 })
    const livingArea = new THREE.Mesh(livingAreaGeometry, livingAreaMaterial)
    livingArea.position.z = -depth * 0.2
    plan.add(livingArea)

    plan.position.y = floorIndex * 0.01
    return plan
  }, [projectData.area, projectData.bedrooms, projectData.bathrooms, floorIndex])

  return <primitive object={planGeometry} />
}

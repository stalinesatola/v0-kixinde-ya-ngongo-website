"use client"

import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, OrbitControls, Environment, Html, Text } from "@react-three/drei"
import { Suspense } from "react"
import * as THREE from "three"

interface House3DProps {
  projectData: {
    projectType?: string
    bedrooms?: string
    bathrooms?: string
    floors?: string
    style?: string
    dimensions?: string
  }
}

function House({ bedrooms = 3, bathrooms = 2, floors = 1 }) {
  const floorHeight = 3
  const width = 8
  const depth = 10
  const normalizedFloors = typeof floors === 'string' ? parseInt(floors, 10) || 1 : floors
  const totalHeight = floorHeight * normalizedFloors

  return (
    <group>
      {/* Chão */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[width + 2, depth + 2]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>

      {/* Paredes */}
      {Array.from({ length: normalizedFloors }).map((_, floorIdx) => {
        const yPos = floorIdx * floorHeight
        return (
          <group key={`floor-${floorIdx}`}>
            {/* Parede frontal */}
            <mesh position={[0, yPos + floorHeight / 2, depth / 2]}>
              <boxGeometry args={[width, floorHeight, 0.3]} />
              <meshStandardMaterial color="#D2691E" />
            </mesh>

            {/* Parede traseira */}
            <mesh position={[0, yPos + floorHeight / 2, -depth / 2]}>
              <boxGeometry args={[width, floorHeight, 0.3]} />
              <meshStandardMaterial color="#CD853F" />
            </mesh>

            {/* Parede esquerda */}
            <mesh position={[-width / 2, yPos + floorHeight / 2, 0]}>
              <boxGeometry args={[0.3, floorHeight, depth]} />
              <meshStandardMaterial color="#D2691E" />
            </mesh>

            {/* Parede direita */}
            <mesh position={[width / 2, yPos + floorHeight / 2, 0]}>
              <boxGeometry args={[0.3, floorHeight, depth]} />
              <meshStandardMaterial color="#D2691E" />
            </mesh>

            {/* Janelas */}
            {[...Array(2)].map((_, i) => (
              <mesh key={`window-${floorIdx}-${i}`} position={[-2 + i * 4, yPos + 1.5, depth / 2 + 0.2]}>
                <boxGeometry args={[1.2, 1, 0.1]} />
                <meshStandardMaterial color="#87CEEB" metalness={0.6} roughness={0.4} />
              </mesh>
            ))}
          </group>
        )
      })}

      {/* Telhado */}
      <mesh position={[0, totalHeight, 0]}>
        <coneGeometry args={[width / 1.5, 2, 4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Porta */}
      <mesh position={[0, 0.75, depth / 2 + 0.2]}>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  )
}

function Scene({ projectData }: House3DProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[15, 12, 20]} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={2}
        enableZoom
        enablePan
        maxDistance={50}
        minDistance={10}
      />
      <Environment preset="sunset" />

      <Suspense fallback={null}>
        <House
          bedrooms={parseInt(projectData.bedrooms || "3")}
          bathrooms={parseInt(projectData.bathrooms || "2")}
          floors={parseInt(projectData.floors || "1")}
        />
      </Suspense>

      {/* Iluminação */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
      <pointLight position={[-10, 15, -10]} intensity={0.5} />

      {/* Informações */}
      <Html position={[0, -5, 0]} center>
        <div className="text-center text-white bg-black/50 px-4 py-2 rounded-lg">
          <p className="text-sm font-sans">
            Quartos: {projectData.bedrooms || 3} | Casas de banho: {projectData.bathrooms || 2} | Andares: {projectData.floors || 1}
          </p>
        </div>
      </Html>
    </>
  )
}

export function House3DViewer({ projectData }: House3DProps) {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-sky-400 to-sky-200">
      <Canvas shadows>
        <Scene projectData={projectData} />
      </Canvas>
    </div>
  )
}

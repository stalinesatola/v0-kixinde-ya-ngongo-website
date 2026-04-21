'use client'

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, Grid, AxesHelper } from '@react-three/drei'
import * as THREE from 'three'

interface SceneViewerProps {
  children: React.ReactNode
  showGrid?: boolean
  showAxes?: boolean
  cameraPosition?: [number, number, number]
  environmentPreset?: 'sunset' | 'studio' | 'forest' | 'city' | 'dawn' | 'night' | 'warehouse' | 'park' | 'apartment' | 'lobby'
}

export function SceneViewer({
  children,
  showGrid = true,
  showAxes = false,
  cameraPosition = [10, 10, 10],
  environmentPreset = 'studio',
}: SceneViewerProps) {
  return (
    <Canvas
      className="w-full h-full"
      gl={{ antialias: true, alpha: true }}
      camera={{ position: cameraPosition, fov: 75 }}
    >
      <PerspectiveCamera makeDefault position={cameraPosition} />
      <OrbitControls
        autoRotate={false}
        autoRotateSpeed={4}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />

      <Environment preset={environmentPreset} />

      {showAxes && <AxesHelper args={[10]} />}
      {showGrid && <Grid args={[20, 20]} cellSize={0.5} />}

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -10]} intensity={0.3} />

      {children}
    </Canvas>
  )
}

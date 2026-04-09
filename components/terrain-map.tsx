"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

interface TerrainMapProps {
  onCoordinatesChange?: (lat: number, lng: number) => void
  initialCoords?: { lat: number; lng: number }
}

declare global {
  interface Window {
    L: any
  }
}

export function TerrainMap({ onCoordinatesChange, initialCoords }: TerrainMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load Leaflet CSS and JS
    if (!window.L) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      document.head.appendChild(link)

      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
      script.onload = () => {
        initMap()
        setIsLoaded(true)
      }
      document.body.appendChild(script)
    } else {
      initMap()
      setIsLoaded(true)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [])

  const initMap = () => {
    if (!mapContainerRef.current) return

    const defaultLat = initialCoords?.lat || -8.8383
    const defaultLng = initialCoords?.lng || 13.2344

    mapRef.current = window.L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 13)

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapRef.current)

    // Add marker
    markerRef.current = window.L.marker([defaultLat, defaultLng], {
      draggable: true,
    }).addTo(mapRef.current)

    markerRef.current.on("dragend", () => {
      const position = markerRef.current.getLatLng()
      onCoordinatesChange?.(position.lat, position.lng)
    })

    mapRef.current.on("click", (e: any) => {
      markerRef.current.setLatLng(e.latlng)
      onCoordinatesChange?.(e.latlng.lat, e.latlng.lng)
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-[#F7A71C]" />
        <p className="text-sm text-muted-foreground">Clique no mapa para selecionar o terreno ou arraste o marcador</p>
      </div>
      <div
        ref={mapContainerRef}
        className="h-96 w-full rounded-lg border border-border overflow-hidden"
        style={{ minHeight: "400px" }}
      />
    </div>
  )
}

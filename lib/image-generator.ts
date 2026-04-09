// Utility to generate architectural concept images
// This creates basic architectural visualizations using Canvas

export function generateArchitecturalVisualization(projectData: {
  projectType: string
  area: string
  floors: string
  style: string
}): string {
  // Create SVG-based architectural visualization
  const svg = `
    <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#D3D3D3;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#A9A9A9;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Sky -->
      <rect width="1200" height="600" fill="url(#skyGradient)"/>
      
      <!-- Ground -->
      <rect y="600" width="1200" height="200" fill="#90EE90"/>
      
      <!-- Project Title -->
      <text x="600" y="50" font-size="48" font-weight="bold" text-anchor="middle" fill="#303030">
        ${projectData.projectType} - ${projectData.style}
      </text>
      
      <!-- Project Info -->
      <text x="600" y="100" font-size="24" text-anchor="middle" fill="#666">
        Área: ${projectData.area} m² | Andares: ${projectData.floors}
      </text>
      
      <!-- Building Structure (simplified representation) -->
      ${generateBuildingShapes(parseInt(projectData.floors))}
      
      <!-- Shadows -->
      <ellipse cx="400" cy="650" rx="250" ry="40" fill="#000" opacity="0.15"/>
      <ellipse cx="800" cy="650" rx="200" ry="35" fill="#000" opacity="0.15"/>
      
      <!-- Company Logo/Footer -->
      <text x="600" y="750" font-size="18" text-anchor="middle" fill="#F7A71C" font-weight="bold">
        KIXINDE YA NGONGO - Arquitectura &amp; Engenharia
      </text>
    </svg>
  `
  
  return svg
}

function generateBuildingShapes(floors: number): string {
  let shapes = ""
  
  // Generate multiple building blocks based on floors
  const blockWidth = 280
  const blockHeight = 50
  const blockSpacing = 50
  
  // Main building
  for (let i = 0; i < floors; i++) {
    const yPos = 550 - (i * blockHeight)
    shapes += `
      <rect x="350" y="${yPos}" width="${blockWidth}" height="${blockHeight}" 
            fill="url(#buildingGradient)" stroke="#666" stroke-width="2"/>
      <!-- Windows row ${i + 1} -->
      ${generateWindows(350, yPos, blockWidth, blockHeight, 6)}
    `
  }
  
  // Secondary building (half height)
  const secondaryFloors = Math.ceil(floors / 2)
  for (let i = 0; i < secondaryFloors; i++) {
    const yPos = 550 - (i * blockHeight)
    shapes += `
      <rect x="700" y="${yPos}" width="250" height="${blockHeight}" 
            fill="#C0C0C0" stroke="#666" stroke-width="2"/>
      <!-- Windows row ${i + 1} -->
      ${generateWindows(700, yPos, 250, blockHeight, 5)}
    `
  }
  
  // Roof elements
  shapes += `
    <!-- Main roof -->
    <polygon points="350,${550 - floors * blockHeight} 630,${520 - floors * blockHeight} 540,${480 - floors * blockHeight}" 
             fill="#8B4513" stroke="#666" stroke-width="2"/>
    
    <!-- Secondary roof -->
    <polygon points="700,${550 - secondaryFloors * blockHeight} 950,${520 - secondaryFloors * blockHeight} 825,${480 - secondaryFloors * blockHeight}" 
             fill="#A0522D" stroke="#666" stroke-width="2"/>
  `
  
  return shapes
}

function generateWindows(x: number, y: number, width: number, height: number, count: number): string {
  let windows = ""
  const windowWidth = 30
  const windowHeight = 25
  const spacing = (width - windowWidth * count) / (count + 1)
  
  for (let i = 0; i < count; i++) {
    const xPos = x + spacing + i * (windowWidth + spacing)
    const yPos = y + (height - windowHeight) / 2
    
    windows += `
      <rect x="${xPos}" y="${yPos}" width="${windowWidth}" height="${windowHeight}" 
            fill="#87CEEB" stroke="#333" stroke-width="1"/>
      <line x1="${xPos + windowWidth / 2}" y1="${yPos}" x2="${xPos + windowWidth / 2}" y2="${yPos + windowHeight}" 
            stroke="#333" stroke-width="1"/>
      <line x1="${xPos}" y1="${yPos + windowHeight / 2}" x2="${xPos + windowWidth}" y2="${yPos + windowHeight / 2}" 
            stroke="#333" stroke-width="1"/>
    `
  }
  
  return windows
}

export async function generateProjectImage(projectData: {
  projectType: string
  area: string
  floors: string
  style: string
}): Promise<Blob> {
  const svg = generateArchitecturalVisualization(projectData)
  
  // Convert SVG to blob
  const blob = new Blob([svg], { type: "image/svg+xml" })
  return blob
}

export function svgToDataUrl(svg: string): string {
  const blob = new Blob([svg], { type: "image/svg+xml" })
  return URL.createObjectURL(blob)
}

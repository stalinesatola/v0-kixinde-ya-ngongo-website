# Visualização 3D - Guia de Uso

## Funcionalidades Implementadas

A plataforma agora exibe uma visualização 3D interativa da casa após a simulação ser concluída.

### Características:

1. **Modelo 3D Procedural**
   - Casa gerada dinamicamente baseada nos dados do formulário
   - Múltiplos andares suportados
   - Telhado, paredes, janelas e porta renderizadas

2. **Controles de Câmara (OrbitControls)**
   - **Mouse Drag**: Rotacione a câmara ao redor da casa
   - **Scroll**: Zoom in/out
   - **Drag com Botão Direito**: Pan (movimento)
   - **Auto Rotate**: A câmara rotaciona automaticamente em modo espera

3. **Iluminação Realista**
   - Luz ambiente
   - Luz direcional para sombras
   - Luz pontual adicional
   - Ambiente sunset predefinido

4. **Informações Exibidas**
   - Número de quartos
   - Número de casas de banho
   - Número de andares

## Como Usar

1. Complete o formulário de simulação
2. Clique em "Gerar Projeto"
3. Aguarde a geração ser concluída
4. A visualização 3D aparecerá automaticamente
5. Use o mouse para explorar a casa:
   - Clique e arraste para rotacionar
   - Scroll para zoom
   - Botão direito para mover

## Arquitetura

### Componente Principal: `house-3d-viewer.tsx`

```typescript
<House3DViewer projectData={formData} />
```

Props:
- `projectData`: Objeto contendo os dados do projecto (bedrooms, bathrooms, floors, etc.)

### Tecnologia

- **React Three Fiber**: Framework React para Three.js
- **Drei**: Utilitários para R3F (OrbitControls, Environment, Html, etc.)
- **Three.js**: Renderização 3D WebGL

## Próximas Melhorias

1. **Modelos GLB Customizados**
   - Integrar modelos 3D de verdade em vez de geometrias procedurais
   - Suporte para diferentes estilos arquitetónicos

2. **Texturizações Reais**
   - Texturas de tijolos, telhas, vidro
   - Materiais PBR mais realistas

3. **Layouts Interiores**
   - Visualização dos compartimentos interiores
   - Disposição de móveis

4. **Export para Realidade Virtual**
   - Exportar para formatos VR
   - Suporte para WebXR

## Troubleshooting

**Se a visualização 3D não aparecer:**
1. Verifique se o componente foi adicionado à página
2. Verifique o console para erros
3. Certifique-se que o formulário foi preenchido corretamente
4. Regenere o projecto

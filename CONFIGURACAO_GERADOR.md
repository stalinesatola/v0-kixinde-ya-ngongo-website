# Sistema de Geração e Entrega de Projetos - Configuração

## Visão Geral

O sistema de gerador de projetos agora inclui:

1. **Mapa Interativo** - Seleção de terreno usando Leaflet/OpenStreetMap
2. **Geração de PDF** - Criação automática de estudo prévio com:
   - Dados do cliente
   - Especificações do projeto
   - Visualização arquitetônica conceitual
   - Recomendações técnicas
3. **Envio por Email** - Integração com Geradoria@kixindeyangongo.ao
4. **Envio por WhatsApp** - Links automáticos para contato direto

## Configuração Necessária

### Variáveis de Ambiente (opcional para produção)

Para habilitar envio de emails automático, adicione ao `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=Geradoria@kixindeyangongo.ao
SMTP_PASS=sua_senha_app_gmail
```

### Sem Configuração

Se não configurar, o sistema funcionará em modo "preview":
- PDF será descarregado localmente
- Link WhatsApp será aberto automaticamente
- Email pode ser configurado manualmente

## Fluxo de Uso

1. **Preencher Formulário**
   - Dados do cliente (nome, email, telefone)
   - Localização e área do terreno
   - Tipo de projeto e especificações

2. **Selecionar Terreno (Opcional)**
   - Abrir mapa interativo
   - Clicar no mapa ou arrastar o marcador
   - Coordenadas são preenchidas automaticamente

3. **Gerar Projeto**
   - IA analisa dados e gera estudo prévio
   - Exibe seções com análise técnica completa

4. **Entregar Estudo**
   - **Download PDF**: Descarrega estudo prévio em PDF
   - **Enviar WhatsApp**: Abre chat com link do projeto
   - **Falar com Equipa**: Contacto direto via WhatsApp

## Arquivos Criados/Modificados

### Novos Arquivos

- `/components/terrain-map.tsx` - Componente do mapa Leaflet
- `/lib/pdf-generator.ts` - Geração de PDFs com jsPDF
- `/lib/image-generator.ts` - Visualizações arquitetônicas
- `/lib/delivery-service.ts` - Serviço de email/WhatsApp
- `/app/api/send-delivery/route.ts` - Endpoint de envio

### Modificados

- `/app/gerador-projetos/page.tsx` - Adicionado mapa e botões de envio
- `/package.json` - Adicionadas dependências (jsPDF, nodemailer)

## Telefone Atualizado

O número de telefone foi atualizado em todos os ficheiros:
- De: +244 923 000 000
- Para: +244 926 899 866

## Integração com Email

Para configurar email real com Gmail:

1. Ativar autenticação em 2 passos no Gmail
2. Gerar "Senha de aplicação" em https://myaccount.google.com/apppasswords
3. Usar a senha gerada em `SMTP_PASS`

Alternativas: SendGrid, Resend, AWS SES, etc.

## Testes Recomendados

1. Preencher formulário completo
2. Usar mapa para selecionar terreno
3. Gerar projeto e verificar conteúdo
4. Descarregar PDF e verificar qualidade
5. Testar link WhatsApp
6. Verificar número de telefone em 926899866

# KIXINDE YA NGONGO - Website de Arquitetura & Engenharia

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.0-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.104.0-3ECF8E)](https://supabase.com/)

Uma plataforma completa de arquitetura e engenharia que utiliza inteligência artificial para transformar terrenos em projetos inteligentes em Angola.

## 🌟 Funcionalidades

### 🏗️ Geração de Projetos com IA
- **Simulador Inteligente**: Geração automática de projetos arquitetônicos usando IA
- **Visualização 3D**: Modelos tridimensionais imersivos dos projetos
- **Análise de Terrenos**: Processamento avançado de dados topográficos
- **Otimização Automática**: Algoritmos de IA para otimizar projetos e prever resultados

### 👨‍💼 Painel Administrativo
- **Configurações da Homepage**: Controle dinâmico de menus, rodapé, cores e seções
- **Gerenciamento de Projetos**: CRUD completo de projetos gerados
- **Configuração de IA**: Gerenciamento de modelos e parâmetros de IA
- **Planos de Assinatura**: Controle de preços e funcionalidades
- **Integração Telegram**: Notificações e alertas via bot

### 💳 Sistema de Pagamentos
- **Stripe Integration**: Processamento seguro de pagamentos
- **Planos Flexíveis**: Diferentes níveis de assinatura
- **Checkout Otimizado**: Experiência de compra simplificada

### 🤖 Assistente de IA
- **Chat Interativo**: Assistente virtual para dúvidas e suporte
- **Integração com Múltiplos Provedores**: Anthropic, Google, OpenAI
- **Contexto Personalizado**: Respostas adaptadas ao contexto angolano

### 📱 Interface Responsiva
- **Design Moderno**: Interface limpa e profissional
- **Mobile-First**: Otimizado para todos os dispositivos
- **Tema Personalizável**: Cores e estilos configuráveis

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 16**: Framework React com App Router
- **TypeScript**: Tipagem estática para maior segurança
- **Tailwind CSS**: Framework CSS utilitário
- **React Three Fiber**: Renderização 3D com Three.js
- **Radix UI**: Componentes acessíveis e customizáveis

### Backend
- **Next.js API Routes**: API RESTful integrada
- **Supabase**: Banco de dados PostgreSQL com autenticação
- **Prisma**: ORM para gerenciamento de dados (planejado)

### IA e Integrações
- **AI SDK**: Integração unificada com provedores de IA
- **Stripe**: Processamento de pagamentos
- **Telegram Bot API**: Notificações automatizadas

### Ferramentas de Desenvolvimento
- **ESLint**: Linting e formatação de código
- **Prettier**: Formatação automática
- **Husky**: Git hooks para qualidade de código
- **Vercel**: Plataforma de deploy

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- pnpm (recomendado) ou npm
- Conta Supabase
- Conta Stripe (para pagamentos)
- Chaves de API dos provedores de IA

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/kixinde-ya-ngongo-website.git
   cd kixinde-ya-ngongo-website
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```

   Edite o arquivo `.env.local` com suas chaves:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Stripe
   STRIPE_PUBLIC_KEY=your_stripe_public_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret

   # AI Providers
   ANTHROPIC_API_KEY=your_anthropic_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
   OPENAI_API_KEY=your_openai_key

   # Telegram
   TELEGRAM_BOT_TOKEN=your_telegram_token
   TELEGRAM_CHAT_ID=your_chat_id
   ```

4. **Configure o banco de dados**
   ```bash
   # Execute os scripts SQL na ordem
   pnpm db:setup
   ```

5. **Execute o projeto**
   ```bash
   pnpm dev
   # ou
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
├── app/                          # Next.js App Router
│   ├── admin/                    # Painel administrativo
│   ├── api/                      # API Routes
│   ├── gerador-projetos/         # Página do gerador
│   └── page.tsx                  # Homepage
├── components/                   # Componentes React
│   ├── 3d/                       # Componentes 3D
│   ├── admin/                    # Componentes admin
│   └── ui/                       # Componentes UI
├── lib/                          # Utilitários e configurações
│   ├── db.ts                     # Conexão Supabase
│   ├── types.ts                  # Tipos TypeScript
│   └── utils.ts                  # Funções utilitárias
├── public/                       # Assets estáticos
├── scripts/                      # Scripts de setup
└── styles/                       # Estilos globais
```

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento
pnpm build        # Build de produção
pnpm start        # Inicia servidor de produção
pnpm lint         # Executa ESLint

# Banco de dados
pnpm db:setup     # Configura tabelas do banco
pnpm db:reset     # Reseta banco de dados

# Testes
pnpm test         # Executa testes
pnpm test:watch   # Testes em modo watch

# Deploy
pnpm deploy       # Deploy para Vercel
```

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte seu repositório**
   - Importe o projeto no Vercel
   - Configure as variáveis de ambiente

2. **Configurações do build**
   ```json
   {
     "buildCommand": "pnpm build",
     "outputDirectory": ".next",
     "installCommand": "pnpm install"
   }
   ```

3. **Variáveis de ambiente**
   - Configure todas as variáveis do `.env.local` no Vercel

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- Render
- Self-hosted

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Use TypeScript para tipagem
- Siga as convenções do ESLint
- Mantenha commits pequenos e descritivos
- Teste suas mudanças

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvimento**: Equipe KIXINDE YA NGONGO
- **Design**: Especialistas em UX/UI
- **Arquitetura**: Engenheiros certificados

## 📞 Contato

- **Website**: [kixinde-ya-ngongo.com](https://kixinde-ya-ngongo.com)
- **Email**: contacto@kixinde-ya-ngongo.com
- **WhatsApp**: +244 926 899 866
- **LinkedIn**: [KIXINDE YA NGONGO](https://linkedin.com/company/kixinde-ya-ngongo)

## 🙏 Agradecimentos

- Comunidade Next.js
- Equipe Supabase
- Provedores de IA (Anthropic, Google, OpenAI)
- Comunidade de desenvolvedores angolanos

---

**KIXINDE YA NGONGO** - Transformando Angola com Inteligência Artificial 🚀
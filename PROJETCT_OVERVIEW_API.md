# Visão Geral do Projeto

## Descrição

API REST destinada a oferecer serviços de tarologia, leitura de cartas e atendimentos místicos por meio de Inteligência Artificial. A aplicação permite que usuários criem sessões de tarot personalizadas, escolham cartas visualmente de um baralho completo de 78 cartas, e recebam interpretações detalhadas e personalizadas geradas por OpenAI GPT-3.5, interagindo com serviços místicos de forma automatizada e inteligente.

## Objetivo

Democratizar o acesso a serviços de tarologia e práticas místicas através de uma plataforma digital que combina conhecimento tradicional com tecnologia de IA, oferecendo interpretações precisas e personalizadas 24 horas por dia.

## Funcionalidades Principais

### 🃏 Sessões de Tarot

- **Criação de Sessões**: Usuários podem iniciar sessões de tarot com temas/perguntas personalizadas
- **Seleção Visual de Cartas**: Interface interativa onde usuários visualizam e escolhem cartas do baralho (78 cartas disponíveis)
- **Interpretação por IA**: Análise detalhada das cartas escolhidas usando OpenAI GPT-3.5 para interpretações profundas e personalizadas
- **Histórico**: Acesso ao histórico completo de sessões realizadas com paginação

### 📊 Sistema de Assinaturas

A aplicação oferece três planos de assinatura com diferentes limites de uso:

#### 🆓 Plano Free

- **Limite**: 2 sessões diárias (qualquer combinação de serviços)
- **Preço**: Gratuito
- **Ideal para**: Usuários que querem experimentar o serviço

#### ⭐ Plano Premium

- **Limite**: 10 sessões diárias (qualquer combinação de serviços)
- **Preço**: R$ 12,99/mês
- **Ideal para**: Usuários regulares que buscam mais profundidade

#### 🚀 Plano Ilimitado

- **Limite**: Ilimitado (sessões ilimitadas por dia)
- **Preço**: R$ 19,99/mês
- **Ideal para**: Usuários frequentes e profissionais

### 💳 Sistema de Pagamento

- **Integração com AbacatePay**: Processamento seguro de pagamentos
- **Métodos suportados**:
  - 💳 Cartão de Crédito
  - 📱 PIX (com confirmação automática via webhook)
- **Gestão automática**: Ativação de assinaturas após confirmação de pagamento

## Arquitetura Técnica

### Stack Tecnológica

- **Backend**: NestJS (Node.js/TypeScript)
- **Banco de Dados**: MongoDB
- **Fila de Processamento**: Redis + BullMQ
- **Autenticação**: JWT (JSON Web Tokens)
- **Pagamentos**: AbacatePay API
- **Email**: Nodemailer (com MailHog para desenvolvimento)
- **IA para Interpretação**: OpenAI GPT-3.5 Turbo (configurável via variável de ambiente)

### Padrões Arquiteturais

- **Domain-Driven Design (DDD)**: Separação clara entre domínio, aplicação e infraestrutura
- **Clean Architecture**: Camadas bem definidas com dependências unidirecionais
- **Event-Driven**: Sistema de eventos para processamento assíncrono
- **Repository Pattern**: Abstração da camada de persistência

### Principais Entidades de Domínio

- **TarotSession**: Representa uma sessão de tarot do usuário
- **TarotCard**: Valor objeto para cartas do tarot (com nome, posição e orientação)
- **SubscriptionPlan**: Planos de assinatura disponíveis
- **Subscription**: Assinatura ativa de um usuário
- **DailyUsage**: Controle de uso diário por serviço

### Baralho de Tarot

O sistema utiliza o baralho completo de Tarot com **78 cartas**:

- **22 Arcanos Maiores**: The Fool, The Magician, The High Priestess, etc.
- **56 Arcanos Menores**: Divididos em 4 naipes (Wands, Cups, Swords, Pentacles)
  - Cada naipe contém 14 cartas (Ace a Ten + Page, Knight, Queen, King)

Cada carta pode aparecer em orientação **Normal** ou **Reversa** (30% de chance), afetando sua interpretação.

## Fluxo de Uso

1. **Cadastro e Autenticação**
   - Usuário se cadastra na plataforma
   - Recebe email de verificação
   - Faz login e recebe token JWT

2. **Assinatura**
   - Usuário escolhe um plano (Free, Premium ou Ilimitado)
   - Para planos pagos, realiza pagamento via cartão ou PIX
   - Assinatura é ativada automaticamente após confirmação

3. **Criação de Sessão**
   - Usuário cria uma sessão de tarot com sua pergunta/tema
   - Sistema verifica limites do plano
   - Sessão é criada e aguarda escolha de cartas pelo usuário

4. **Seleção e Interpretação de Cartas**
   - Usuário visualiza todas as 78 cartas disponíveis (com verso)
   - Usuário clica e escolhe as cartas desejadas (1 a 10 cartas)
   - Frontend valida a seleção e envia os IDs das cartas escolhidas
   - Sistema processa a seleção e define orientação (normal/reversa)
   - OpenAI GPT-3.5 interpreta as cartas escolhidas em relação ao tema da sessão
   - Usuário recebe análise detalhada e personalizada

5. **Acompanhamento**
   - Usuário pode consultar histórico de sessões
   - Visualiza interpretações anteriores
   - Monitora uso diário e limites restantes

## Regras de Negócio

### Limites Diários

- **Limite Global**: Os planos utilizam limite global diário (não por serviço)
- **Reset Diário**: Limites são resetados a cada dia
- **Validação em Tempo Real**: Sistema verifica limites antes de permitir uso

### Pagamentos

- **PIX**: Assinatura criada com status `PENDING_PAYMENT` até confirmação
- **Cartão**: Assinatura ativada imediatamente após aprovação
- **Webhook**: Confirmação automática de pagamentos PIX via webhook do AbacatePay

### Validações

- **Email Verificado**: Usuários devem verificar email antes de usar serviços principais
- **Assinatura Ativa**: Serviços requerem assinatura ativa (Free, Premium ou Ilimitado)
- **Limite Diário**: Uso bloqueado quando limite diário é atingido
- **Seleção de Cartas**: Usuário pode escolher de 1 a 10 cartas por sessão
- **Cartas Únicas**: Não é permitido selecionar a mesma carta duas vezes
- **Cartas Válidas**: Apenas cartas do baralho padrão (78 cartas) são aceitas

## Endpoints Principais

### Autenticação

- `POST /users` - Criar conta
- `POST /users/login` - Fazer login
- `GET /users/verify-email` - Verificar email

### Assinaturas

- `GET /subscriptions/plans` - Listar planos disponíveis
- `GET /subscriptions/current` - Obter assinatura atual
- `POST /subscriptions/subscribe` - Assinar um plano
- `POST /subscriptions/cancel` - Cancelar assinatura
- `GET /subscriptions/usage` - Verificar uso do serviço

### Tarot

- `POST /tarot/sessions` - Criar nova sessão
- `GET /tarot/sessions` - Listar sessões (com paginação)
- `GET /tarot/sessions/:id` - Obter detalhes da sessão
- `GET /tarot/cards/available` - Listar todas as cartas disponíveis (78 cartas)
  - Query param `limit` (opcional): Retornar apenas N cartas aleatórias
- `POST /tarot/sessions/:id/draw-cards` - Confirmar escolha de cartas
  - Body: `{ selectedCardIds: string[] }` - IDs das cartas escolhidas pelo usuário
- `POST /tarot/sessions/:id/interpret` - Interpretar cartas com IA (OpenAI GPT-3.5)

### Webhooks

- `POST /webhooks/abacatepay/payment` - Receber notificações do AbacatePay

## Ambiente de Desenvolvimento

### Serviços Necessários

- **MongoDB**: Banco de dados
- **Redis**: Fila de processamento e cache
- **MailHog**: Servidor SMTP para desenvolvimento (captura emails)

### Variáveis de Ambiente

```env
# Database
MONGO_URI=mongodb://admin:password@localhost:27017/anonpix?authSource=admin

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Email (desenvolvimento com MailHog)
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_FROM=noreply@localhost

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# AbacatePay (opcional para desenvolvimento)
USE_ABACATEPAY=false
ABACATEPAY_API_KEY=your-api-key
ABACATEPAY_ENVIRONMENT=sandbox

# OpenAI (para interpretação de cartas)
USE_OPENAI=false
OPENAI_API_KEY=sk-your-openai-api-key

# Application
APP_URL=http://localhost:3000
```

## Roadmap Futuro

### Funcionalidades Planejadas

- 📱 **App Mobile**: Versão mobile nativa
- 🔮 **Mais Tipos de Leitura**: Astrologia, Numerologia, etc.
- 👥 **Perfis de Tarólogos**: Integração com tarólogos reais
- 💬 **Chat em Tempo Real**: Atendimento interativo
- 📊 **Dashboard Analytics**: Estatísticas e insights para usuários
- 🌍 **Multi-idioma**: Suporte a múltiplos idiomas
- 🎨 **Personalização**: Temas e configurações personalizadas

### Melhorias Técnicas

- ⚡ **Cache Inteligente**: Cache de interpretações comuns
- 🔐 **Autenticação 2FA**: Segurança adicional
- 📈 **Monitoramento**: APM e logs estruturados
- 🧪 **Testes E2E**: Cobertura completa de testes
- 🚀 **CI/CD**: Pipeline automatizado de deploy

## Contribuição

Este é um projeto privado. Para sugestões e melhorias, entre em contato com a equipe de desenvolvimento.

## Licença

Proprietário - Todos os direitos reservados.

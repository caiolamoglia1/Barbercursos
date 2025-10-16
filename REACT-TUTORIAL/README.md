# Barber Cursos — React + Vite + Firebase

Este repositório é uma aplicação de ensino online (Barber Cursos) construída com React no frontend e Firebase (Cloud Functions + Firestore) no backend.

Resumo rápido

- Frontend: React  (Vite)
- Backend: Firebase Cloud Functions (Express) + Firestore via firebase-admin
- Pagamentos: atualmente existe um endpoint manual `/api/subscribe` que ativa assinaturas sem processar pagamentos. A seguir há instruções para integrar o Stripe Checkout.

Estrutura relevante

- `src/` — código React (rotas, páginas, componentes)
- `src/pages/PlansPage/PlansPage.jsx` — página que mostra planos e inicia o fluxo de assinatura
- `functions/` — Cloud Functions (Express) e scripts utilitários
	- `functions/index.js` — app Express exportado como `exports.api`
	- `functions/seedPlans.js` — script para criar documentos `plans/{basic,pro,elite}`

Visão geral do fluxo de assinaturas atual

- Frontend chama `POST /api/subscribe` com `{ planId, userId }`.
- O endpoint cria/atualiza `users/{userId}/subscriptions/{planId}` com `active: true` e `method: 'manual'`.
- Não há processamento real de pagamento — é um stub para desenvolvimento e testes locais.

Integrando o Stripe (opcional)

O projeto inclui instruções e mudanças sugeridas para substituir o fluxo manual por um fluxo real com Stripe Checkout e webhook. O fluxo básico:

1. Frontend pede ao backend para criar uma sessão de checkout: `POST /api/create-checkout-session`.
2. Backend cria a sessão no Stripe usando o `stripePriceId` armazenado em `plans/{planId}` e retorna `sessionId`.
3. Frontend redireciona o usuário para o Stripe Checkout (página hospedada pela Stripe).
4. Stripe envia um evento para `POST /api/stripe-webhook` quando o pagamento é confirmado. O webhook valida a assinatura e ativa `users/{uid}/subscriptions/{planId}`.

Passo a passo rápido (desenvolvimento local)

1) Dependências

No frontend (raiz):

```bash
npm install @stripe/stripe-js
```

No backend (pasta `functions`):

```bash
cd functions
npm install stripe
```

2) Configurar chaves do Stripe

- No Dashboard do Stripe, gere sua `Publishable key` e `Secret key`.
- Para desenvolvimento local, salve o segredo do webhook recebido pela Stripe CLI em `functions/.env` (ou use `firebase functions:config:set` em produção):

```bash
# Em produção (CLI do Firebase)
firebase functions:config:set stripe.secret_key="sk_test_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
```

3) Atualizar os planos com `stripePriceId`

- Crie produtos e preços no Stripe e atualize `functions/seedPlans.js` para incluir `stripePriceId` em cada plano.

Exemplo (em `functions/seedPlans.js`):

```js
const plans = {
	basic: { title: 'Plano Básico', price: 0, interval: 'one-time', description: 'Acesso a módulos gratuitos', stripePriceId: '' },
	pro: { title: 'Plano Pro', price: 29.0, interval: 'monthly', description: 'Acesso completo a todos os módulos', stripePriceId: 'price_...'},
	elite: { title: 'Plano Elite', price: 199.0, interval: 'yearly', description: 'Acesso anual completo e aulas exclusivas', stripePriceId: 'price_...'}
};
```

4) Executar emulação e seed

- Rode o Firebase Emulator Suite (Firestore + Functions):

```bash
firebase emulators:start --only firestore,functions
```

- Em outro terminal, dentro de `functions/` rode o seed:

```bash
node seedPlans.js
```

5) Testar o webhook localmente com Stripe CLI

- Inicie seu emulador (ver passo anterior). Em outro terminal, rode:

```bash
# Substitua <project-id> e a porta se necessário
stripe listen --forward-to http://127.0.0.1:5001/<project-id>/us-central1/api/stripe-webhook
```

- A CLI fornecerá um `whsec_...` que você pode usar nas variáveis locais.

6) Frontend

- Instale `@stripe/stripe-js` e atualize `src/pages/PlansPage/PlansPage.jsx` para chamar `/api/create-checkout-session` e usar `loadStripe` para redirecionar o usuário.

Notas e recomendações

- O endpoint atual `/api/subscribe` permanece útil para testes locais sem pagamento.
- Em produção, valide externamente as notificações de pagamento antes de ativar assinaturas.
- Considere adicionar campos de expiração `expiresAt` e rotinas para desativar assinaturas expiradas.
- Atualize a engine Node no `functions/package.json` se precisar de Node 18+.

Conclusão

Este projeto é uma plataforma de cursos em React com backend em Firebase; hoje ele suporta um fluxo de assinatura manual via `POST /api/subscribe` e utiliza um conjunto de scripts e emuladores para facilitar o desenvolvimento local. A integração com provedores de pagamento foi removida e pode ser substituída facilmente na camada do servidor quando você escolher o próximo provedor.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

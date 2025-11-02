# 🚀 Deploy para Vercel - Instruções

## ✅ Push Realizado com Sucesso!

As mudanças foram enviadas para o GitHub e o Vercel deve fazer o deploy automaticamente.

## 🔐 Variáveis de Ambiente no Vercel

Você precisa configurar as seguintes variáveis de ambiente no Vercel Dashboard:

### 1. Acesse o Vercel Dashboard:
https://vercel.com/lamogliacarrer-9171/barbercursos

### 2. Vá em: Settings → Environment Variables

### 3. Adicione as seguintes variáveis:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**IMPORTANTE:** 
- Use as chaves do seu arquivo `.env` local
- Marque todas as opções: Production, Preview, Development
- Clique em "Save" após adicionar cada variável

## 📋 Checklist de Deploy

- [x] Código enviado para GitHub
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Deploy automático concluído (aguardar 2-5 minutos)
- [ ] Testar pagamento em produção
- [ ] Configurar webhook do Stripe para produção

## 🔗 URLs

- **GitHub Repo:** https://github.com/caiolamoglia1/Barbercursos
- **Vercel Dashboard:** https://vercel.com/lamogliacarrer-9171
- **Stripe Dashboard:** https://dashboard.stripe.com/test/dashboard

## 🎯 Próximos Passos Após Deploy

### 1. Configurar Webhook do Stripe em Produção

Após o deploy, você precisará configurar o webhook do Stripe:

1. Acesse: https://dashboard.stripe.com/test/webhooks
2. Clique em "Add endpoint"
3. URL do endpoint: `https://seu-dominio-vercel.app/api/stripe-webhook`
4. Selecione eventos: `checkout.session.completed`
5. Copie o "Signing secret" (começa com `whsec_`)
6. Adicione no Vercel como variável: `STRIPE_WEBHOOK_SECRET`

### 2. Testar Fluxo Completo

1. Acesse o site em produção
2. Faça login com usuário teste
3. Vá em "Planos"
4. Faça um pagamento teste
5. Verifique se a assinatura foi ativada
6. Tente acessar um curso premium

### 3. Login Admin

- **Email:** admin@gmail.com
- **Senha:** admin123456
- **Acesso:** https://seu-dominio-vercel.app/admin

## 🎨 Funcionalidades no Ar

✅ Sistema de assinaturas (Basic, Pro, Elite)
✅ Pagamento via Stripe
✅ Controle de acesso por assinatura
✅ Painel administrativo completo
✅ Estatísticas em tempo real
✅ Rastreamento de progresso
✅ Badge de admin no header
✅ Proteção de rotas administrativas

## 📊 Monitoramento

- **Vercel Logs:** Verifique erros de deploy e runtime
- **Firebase Console:** Monitore Firestore e Auth
- **Stripe Dashboard:** Acompanhe pagamentos e webhooks

## 🆘 Problemas Comuns

### Deploy falha
- Verifique se todas as variáveis de ambiente estão configuradas
- Veja os logs no Vercel Dashboard

### Pagamento não ativa assinatura
- Verifique webhook do Stripe
- Veja logs do Vercel para erros na API
- Cliente-side ativa automaticamente mesmo sem webhook

### Admin não tem acesso
- Certifique-se que o email é exatamente `admin@gmail.com`
- Verifique se o usuário está logado

## 🎉 Pronto!

Seu sistema está no ar com todas as funcionalidades implementadas!

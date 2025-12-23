# Exemplos de Body JSON para Assinar Plano Premium

## Endpoint

```
POST /subscriptions/subscribe
```

## Autenticação

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Exemplo 1: Pagamento com Cartão de Crédito

```json
{
  "planId": "plan-premium-001",
  "paymentMethod": "CREDIT_CARD",
  "cardData": {
    "cardNumber": "4111111111111111",
    "cardHolderName": "João Silva",
    "expirationMonth": 12,
    "expirationYear": 2025,
    "cvv": "123"
  }
}
```

**Campos obrigatórios:**

- `planId`: ID do plano (use "plan-premium-001" para Premium)
- `paymentMethod`: "CREDIT_CARD" ou "DEBIT_CARD"
- `cardData`: Objeto com dados do cartão (obrigatório quando paymentMethod é CREDIT_CARD ou DEBIT_CARD)
  - `cardNumber`: Número do cartão (sem espaços ou hífens)
  - `cardHolderName`: Nome do portador do cartão
  - `expirationMonth`: Mês de expiração (1-12)
  - `expirationYear`: Ano de expiração (ex: 2025)
  - `cvv`: Código de segurança (3 ou 4 dígitos)

---

## Exemplo 2: Pagamento via PIX

```json
{
  "planId": "plan-premium-001",
  "paymentMethod": "PIX"
}
```

**Campos obrigatórios:**

- `planId`: ID do plano
- `paymentMethod`: "PIX"

**Campos opcionais:**

- `cpfCnpj`: CPF (11 dígitos) ou CNPJ (14 dígitos) - Opcional (não é necessário para criar QR Code PIX)

---

## Exemplo 3: Sem método de pagamento (para planos gratuitos)

```json
{
  "planId": "plan-free-001"
}
```

**Nota:** Para planos pagos (como Premium), o `paymentMethod` é obrigatório.

---

## Teste com cURL

### Cartão de Crédito:

```bash
curl -X POST http://localhost:3000/subscriptions/subscribe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_JWT_TOKEN_AQUI" \
  -d '{
    "planId": "plan-premium-001",
    "paymentMethod": "CREDIT_CARD",
    "cardData": {
      "cardNumber": "4111111111111111",
      "cardHolderName": "João Silva",
      "expirationMonth": 12,
      "expirationYear": 2025,
      "cvv": "123"
    }
  }'
```

### PIX:

```bash
curl -X POST http://localhost:3000/subscriptions/subscribe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_JWT_TOKEN_AQUI" \
  -d '{
    "planId": "plan-premium-001",
    "paymentMethod": "PIX"
  }'
```

---

## Teste com Insomnia/Postman

1. **Method:** POST
2. **URL:** `http://localhost:3000/subscriptions/subscribe`
3. **Headers:**
   - `Content-Type: application/json`
   - `Authorization: Bearer <seu_token_jwt>`
4. **Body (JSON):**
   ```json
   {
     "planId": "plan-premium-001",
     "paymentMethod": "CREDIT_CARD",
     "cardData": {
       "cardNumber": "4111111111111111",
       "cardHolderName": "João Silva",
       "expirationMonth": 12,
       "expirationYear": 2025,
       "cvv": "123"
     }
   }
   ```

---

## Validações

- `planId`: Obrigatório, deve existir no banco de dados
- `paymentMethod`: Opcional, mas obrigatório para planos pagos. Valores aceitos: "CREDIT_CARD", "DEBIT_CARD", "PIX"
- `cardData`: Obrigatório quando `paymentMethod` é "CREDIT_CARD" ou "DEBIT_CARD"
  - `cardNumber`: String, 13-19 dígitos
  - `expirationMonth`: Número, 1-12
  - `expirationYear`: Número, >= ano atual
  - `cvv`: String, 3-4 dígitos
- `cpfCnpj`: Opcional (não necessário para PIX)
  - CPF: 11 dígitos (ex: "12345678901")
  - CNPJ: 14 dígitos (ex: "12345678000190")

---

## Resposta de Sucesso

```json
{
  "subscription": {
    "id": "sub-1766277921003-t116j88mf",
    "userId": "1766097610527-ozrvewuxl",
    "planId": "plan-unlimited-001",
    "status": "PENDING_PAYMENT",
    "startDate": "2025-12-21T00:45:21.003Z",
    "endDate": null,
    "cancelledAt": null,
    "createdAt": "2025-12-21T00:45:21.003Z"
  },
  "plan": {
    "id": "plan-unlimited-001",
    "name": "Unlimited",
    "description": "Plano Ilimitado com acesso sem restrições",
    "price": 1999,
    "billingPeriod": "MONTHLY",
    "globalDailyLimit": -1,
    "features": [],
    "isActive": true,
    "createdAt": "2025-12-18T18:34:48.136Z"
  },
  "payment": {
    "paymentId": "pix_char_1TeHYEF5axerDAAKBzKrJDNe",
    "status": "PENDING",
    "transactionId": "pix_char_1TeHYEF5axerDAAKBzKrJDNe",
    "message": "PIX gerado. Aguardando pagamento.",
    "qrCode": "data:image/png;base64,......",
    "pixCode": "string"
  }
}
```

---

## Cartões de Teste (AbacatePay Sandbox)

Para testar no ambiente sandbox do AbacatePay, consulte a documentação da API para os cartões de teste disponíveis.

**Nota:** Os cartões de teste podem variar. Consulte a documentação oficial do AbacatePay para mais informações.

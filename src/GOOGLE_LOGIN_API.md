# Login com Google - Documentação

## Visão Geral

Este documento descreve a implementação do login com Google OAuth 2.0 no backend da aplicação. O sistema permite que usuários façam login usando suas contas do Google, validando o token ID fornecido pelo Google e retornando um JWT token para autenticação nas requisições subsequentes.

## Configuração

### 1. Variáveis de Ambiente

Adicione a seguinte variável de ambiente no seu arquivo `.env`:

```env
GOOGLE_CLIENT_ID=seu-google-client-id-aqui
```

**Onde obter o Client ID:**

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services** > **Credentials**
4. Clique em **Create Credentials** > **OAuth client ID**
5. Configure o tipo de aplicação (Web application)
6. Adicione os URIs de redirecionamento autorizados
7. Copie o **Client ID** gerado

### 2. Dependências

As seguintes dependências já estão instaladas:

- `google-auth-library` - Para validação de tokens do Google
- `passport-google-oauth20` - Para estratégia OAuth (opcional, para uso futuro)
- `@types/passport-google-oauth20` - Tipos TypeScript

## Endpoint

### POST `/users/login/google`

Autentica um usuário usando o token ID do Google.

#### Request Body

```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
}
```

**Campos:**

- `idToken` (string, obrigatório): Token ID obtido do Google após login bem-sucedido

#### Response (200 OK)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1234567890-abcdefgh",
    "name": "João Silva",
    "email": "joao.silva@gmail.com",
    "emailVerified": true
  }
}
```

#### Response (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": "ID token is required"
}
```

#### Response (500 Internal Server Error)

```json
{
  "statusCode": 500,
  "message": "Google token verification failed: [detalhes do erro]"
}
```

### 1. Backend

O backend realiza as seguintes etapas:

1. **Validação do Request**: Verifica se o `idToken` foi fornecido
2. **Validação do Token Google**: Usa `google-auth-library` para verificar a autenticidade do token
3. **Busca/Criação de Usuário**:
   - Se existe usuário com o `googleId`: retorna o usuário existente
   - Se não existe, mas existe usuário com o mesmo email: vincula o `googleId` ao usuário existente
   - Se não existe nenhum: cria novo usuário do Google
4. **Geração de JWT**: Gera um token JWT válido por 14 dias
5. **Retorno**: Retorna o `accessToken` e dados do usuário

## Comportamento do Sistema

### Criação de Usuário

Quando um usuário faz login com Google pela primeira vez:

- Um novo registro é criado no banco de dados
- O campo `googleId` é preenchido com o ID único do Google
- O campo `passwordHash` fica como `null` (usuários do Google não têm senha)
- O campo `emailVerified` é automaticamente definido como `true` (emails do Google são verificados)
- O campo `emailVerificationToken` fica como `null`

### Vinculação de Contas

Se um usuário já possui uma conta criada com email/senha e depois faz login com Google usando o mesmo email:

- O sistema vincula o `googleId` à conta existente
- O usuário pode continuar usando tanto login tradicional quanto Google
- A senha original é preservada

### Usuários Existentes

Se um usuário já fez login com Google anteriormente:

- O sistema encontra o usuário pelo `googleId`
- Retorna o JWT token sem criar novo registro

## Estrutura de Dados

### Entidade User

A entidade `User` foi atualizada para suportar login com Google:

```typescript
class User {
  id: string;
  name: string;
  email: string;
  passwordHash: string | null; // null para usuários do Google
  createdAt: Date;
  emailVerified: boolean;
  emailVerificationToken: string | null;
  googleId: string | null; // ID único do Google
}
```

### Schema MongoDB

O schema do MongoDB inclui:

- `googleId`: Campo único e indexado (sparse index) para busca rápida
- `passwordHash`: Agora é opcional (pode ser `null`)

## Tratamento de Erros

### Erros Comuns

1. **Token Inválido**

   ```
   Google token verification failed: Invalid token signature
   ```

   - O token pode estar expirado ou inválido
   - Verifique se o `GOOGLE_CLIENT_ID` está correto

2. **Token Não Fornecido**

   ```
   ID token is required
   ```

   - O front-end não enviou o `idToken` no request

3. **Email Já Existe**

   ```
   User with this email already exists
   ```

   - Ocorre quando tenta vincular um `googleId` a um email que já possui outro `googleId`

4. **Client ID Não Configurado**
   ```
   GOOGLE_CLIENT_ID environment variable is required
   ```
   - A variável de ambiente não foi configurada

## Segurança

### Validação de Token

O sistema valida o token do Google usando a biblioteca oficial `google-auth-library`, garantindo:

- Verificação da assinatura do token
- Validação da audiência (audience) do token
- Verificação de expiração
- Validação da estrutura do payload

### JWT Token

Após validação bem-sucedida, o sistema retorna um JWT token que:

- Expira em 14 dias
- Contém informações do usuário (id, email, emailVerified)
- Deve ser enviado no header `Authorization: Bearer <token>` nas requisições autenticadas

## Exemplo Completo

### Front-end (React)

```typescript
import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

function GoogleLoginButton() {
  useEffect(() => {
    // Carregar script do Google
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      const res = await fetch("http://localhost:3000/users/login/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: response.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        console.log("Login bem-sucedido!", data.user);
        // Redirecionar ou atualizar estado
      } else {
        console.error("Erro no login:", data.message);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const handleLogin = () => {
    window.google.accounts.id.prompt();
  };

  return <button onClick={handleLogin}>Entrar com Google</button>;
}
```

### Backend (Teste com cURL)

```bash
curl -X POST http://localhost:3000/users/login/google \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
  }'
```

## Arquivos Relacionados

- `src/domain/use-cases/user/google-login.use-case.ts` - Lógica de negócio
- `src/infrastructure/auth/google-auth.service.ts` - Serviço de validação do Google
- `src/infrastructure/http/controllers/user.controller.ts` - Controller HTTP
- `src/infrastructure/http/dto/user/google-login.dto.ts` - DTO de validação
- `src/domain/entities/user.entity.ts` - Entidade User
- `src/infrastructure/persistence/mongodb/schemas/user.schema.ts` - Schema MongoDB

## Notas Importantes

1. **Client ID**: O `GOOGLE_CLIENT_ID` deve ser o mesmo usado no front-end
2. **Domínios Autorizados**: Configure os domínios autorizados no Google Cloud Console
3. **HTTPS**: Em produção, use HTTPS para garantir segurança
4. **Token Expiration**: Tokens do Google expiram após 1 hora, mas o JWT retornado é válido por 14 dias
5. **Email Verification**: Usuários do Google têm `emailVerified: true` automaticamente

## Troubleshooting

### Problema: "Google token verification failed"

**Soluções:**

- Verifique se o `GOOGLE_CLIENT_ID` está correto
- Confirme que o token não expirou (tokens do Google expiram em 1 hora)
- Verifique se o Client ID no front-end é o mesmo do backend

### Problema: "ID token is required"

**Solução:**

- Certifique-se de que o front-end está enviando o campo `idToken` no body da requisição

### Problema: Usuário não é criado

**Soluções:**

- Verifique os logs do servidor para erros específicos
- Confirme que o banco de dados está acessível
- Verifique se há restrições de índice único no MongoDB

## Referências

- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs)
- [OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

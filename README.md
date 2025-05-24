# Auth Service

Este projeto é um serviço de autenticação e autorização construído com [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/), [CASL](https://casl.js.org/) para controle de permissões e [JWT](https://jwt.io/) para autenticação.

## Funcionalidades

- Cadastro e autenticação de usuários com JWT
- Controle de acesso baseado em funções (Roles: ADMIN, READER, WRITER, EDITOR)
- Permissões granulares usando CASL
- CRUD de usuários e posts
- Validação de dados com `class-validator`
- Hash de senha com `bcrypt`
- Banco de dados PostgreSQL via Prisma

## Estrutura das Roles

- **ADMIN**: acesso total ao sistema
- **WRITER**: pode ler, criar e atualizar seus próprios posts
- **EDITOR**: pode ler, criar e atualizar seus próprios posts
- **READER**: pode ler posts publicados

## Como rodar localmente

1. **Clone o repositório**
   ```sh
   git clone https://github.com/gransottodev/auth-service.git
   cd auth-service
   ```

2. **Instale as dependências**
   ```sh
   npm install
   ```

3. **Suba o banco de dados com Docker Compose**
   ```sh
   docker compose up -d
   ```
   O banco estará disponível em `localhost:5432` com:
   - Usuário: `root`
   - Senha: `root`
   - Banco: `mydb`

4. **Configure as variáveis de ambiente**

   Crie um arquivo `.env` na raiz do projeto com as variáveis:
   ```
   DATABASE_URL=postgresql://root:root@localhost:5432/mydb
   JWT_SECRET_KEY=sua_chave_secreta
   ```

5. **Rode as migrations do Prisma**
   ```sh
   npx prisma migrate deploy
   ```

6. **Inicie o servidor**
   ```sh
   npm run start:dev
   ```

## Scripts úteis

- `npm run start:dev` — inicia o servidor em modo desenvolvimento
- `npm run build` — compila o projeto
- `npm run test` — executa os testes
- `npm run lint` — verifica o código com ESLint

## Estrutura do Projeto

```
src/
  ├── auth/         # Módulo de autenticação e guards
  ├── casl/         # Permissões e regras de acesso
  ├── prisma/       # Serviço de acesso ao banco de dados
  ├── posts/        # CRUD de posts
  ├── users/        # CRUD de usuários
  └── main.ts       # Bootstrap da aplicação
```

## Tecnologias

- **NestJS** — framework Node.js para aplicações escaláveis
- **Prisma ORM** — mapeamento objeto-relacional
- **PostgreSQL** — banco de dados relacional
- **CASL** — controle de acesso baseado em regras
- **JWT** — autenticação baseada em tokens
- **bcrypt** — hash de senhas
- **Docker Compose** — orquestração do banco de dados

## Licença

Este projeto está sob a licença UNLICENSED.

---

> Feito com ❤️ usando NestJS, Prisma e PostgreSQL.

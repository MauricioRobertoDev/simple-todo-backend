# Simple Todo Backend API (Estudo)

Uma pequena API para criação de todos com uma breve descrição, o usuário pode se registrar, logar atráves de JWT, tabém pode criar, editar, atualizar status e excluir suas todos.

## 🎓 Aprendizados

- Como instalar e configurar husky com lint-staged.
- Como instalar e configurar prettier com eslint.
- Vários códigos http.
- O que é e como funciona repository pattern.
- O que é e como funciona value objects.
- Como criar uma aplicação com nodejs.
- Como ultilizar o express e criar middlewares para ele.
- Como extender typos do typescrip com a pasta @types.
- Como funciona e como fazer login ultilizando Json Web Token.
- Como usar serviços para fazer uma unica coisa e como pode ser últil para ser reaproveitado.
- Como a injeção de dependência auxiliar na criar testes na aplicação.
- Como a criação de testes automatizados pode ajudar a prever bugs antes mesmo de acontecer, e manter uma aplicação mais sólida.
- Como usar o vitest para teste automatizados.
- Como configurar setup para vitest, e criar configurações diferentes para testes unitários e e2e.
- Como usar o supertest para testes e2e, replicando um comportamento real na aplicação.
- Como o docker funciona e como criar uma arquivo docker-compose para um banco de dados.
- Além disso o projeto me deu uma visão mais clara de muitas coisas que antes estavam um pouco confusas.

## ⚙️ Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env, no projeto existe o .env.example você pode renomear para .env e descomentar as variáveis, elas já estão setadas com as variáveis do banco de dados de desenvolvimento incluso no projeto.

`SERVER_PORT`

`APP_SECRET`

`DATABASE_URL`

## 💻 Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/MauricioRobertoDev/simple-todo-backend.git
```

Entre no diretório do projeto

```bash
  cd simple-todo-backend
```

Instale as dependências

```bash
  npm install
```

Suba o banco de dados, mas antes verifique se o docker está rodando

```bash
  docker-compose up -d
```

Configure o banco de dados

```bash
  npm run migrate
```

Inicie o servidor

```bash
  npm run start
```

## 🔥 Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  //Testes unitários
  npm run test

  //Testes com coverage
  npm run test:coverage

  //Testes e2e
  npm run test:e2e
```

## 🔠 Funcionalidades

- Registro de usuário
- Login de usuário
- Criação de todo
- Edição de todo
- Atualização de status de todo
- Exclusão de todo

## 🚀 O que foi utilizado

- Node,
- Typescript
- ESLint
- Prettier
- Husky
- Express
- JWT
- Vitest
- Supertest
- Prisma
- Bcrypt
- DotEnv

## 💼 Documentação da API

#### Registrar um novo usuário

```http
  POST /registrar
```

| Parâmetro  | Tipo     | Descrição        |
| :--------- | :------- | :--------------- |
| `name`     | `string` | **Obrigatório**. |
| `email`    | `string` | **Obrigatório**. |
| `password` | `string` | **Obrigatório**. |

Retorna os dados do usuário

#### Loga uma usuário

```http
  POST /entrar
```

| Parâmetro  | Tipo     | Descrição        |
| :--------- | :------- | :--------------- |
| `email`    | `string` | **Obrigatório**. |
| `password` | `string` | **Obrigatório**. |

Retorna os dados do usuário com um jwt para acesso

**A partir daqui é necessário o token JWT no header authorization -> Bearer {token}**.

#### Cria uma nova todo

```http
  POST /nova-todo
```

| Parâmetro     | Tipo     | Descrição        |
| :------------ | :------- | :--------------- |
| `description` | `string` | **Obrigatório**. |

Retorna os dados da nova todo

#### Edita uma todo

```http
  POST /editar-todo/:id
```

| Parâmetro     | Tipo     | Descrição        |
| :------------ | :------- | :--------------- |
| `description` | `string` | **Obrigatório**. |

Retorna os dados atualizados da todo

#### Atualiza o status de uma todo

```http
  POST /atualizar-status-todo/:id
```

Retorna os dados atualizados da todo, na primeira vez entra em progresso e na segunda vez finaliza a todo

#### Exclui uma todo

```http
  DELETE /excluir-todo/:id
```

Retorna uma mensagem de sucesso.

#### Pega todos

```http
  GET /listar-todos
```

Retorna uma lista com dados das todos.

# Intranet da Intendência — integração com a API

Este frontend está preparado para o backend ASP.NET Core adaptado (`AplicacaoBackEnd1-Adaptado`).

## Endereço da API

O endereço fica centralizado em `src/app/services/api-config.ts`:

```ts
export const API_URL = 'https://localhost:7067/api';
```

Se a porta do backend mudar, altere somente essa constante.

## Executar

1. Inicie o MySQL e confira se o banco `bd_aula_backend` está configurado no backend.
2. Abra o backend no Visual Studio e execute o perfil **https** (porta `7067`).
3. Antes de usar o frontend, abra `https://localhost:7067/swagger` no navegador e aceite/conclua a confiança do certificado HTTPS de desenvolvimento, se o navegador solicitar.
4. Na pasta deste Angular, execute `npm install` e depois `npm start`.
5. Acesse `http://localhost:4200`.

Use Node.js `22.22.3` ou superior dentro da linha 22, ou `24.15.0` ou superior (conforme o requisito do Angular CLI 22.2.3).

O backend permite CORS para `http://localhost:4200` e `https://localhost:4200`. Use `localhost`, não `127.0.0.1`, para corresponder à origem configurada.

## Sessão

O backend autentica por cookie. O interceptor `credentials.interceptor.ts` envia `withCredentials: true` automaticamente em todas as chamadas para a API. Não remova esse interceptor: sem ele o login pode até responder com sucesso, mas as rotas protegidas retornarão HTTP 401/403.

## Rotas e operações utilizadas

- `Identificacao`: login por CPF/data de nascimento, sessão atual e logout.
- `PessoaEndereco`: cadastro público de Guerreiro; consulta, alteração e exclusão administrativa.
- `Funcionario`: cadastro e manutenção dos integrantes da Intendência.
- `Catalogo`, `Categorium`, `ProdutoItem`, `Itens`: pesquisa pública do catálogo e manutenção administrativa de categorias, produtos e serviços.
- `Atendimento`: compra do carrinho, consulta dos próprios pedidos, manutenção administrativa, transição de status e cancelamento.
- `Estoque` e `EntradaProduto`: consulta e movimentação do estoque; exclusão de entrada é apresentada como **estorno**.

## Dependências e arquivos gerados

O ZIP não inclui `node_modules` nem `.angular/cache`. Execute `npm install` para restaurar as dependências em sua máquina. O `package-lock.json` foi preservado.

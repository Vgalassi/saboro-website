# Saboro: Site de receitas

Bem-vindo ao repositório do **Saboro**. O Saboro é um site para descobrir e criar receitas culinárias. A arquitetura da aplicação é baseada em uma arquitetura full-stack que separa o front-end e o back-end.

---

## Tecnologias Utilizadas

### Front-end
- **React**: Uma biblioteca JavaScript para construir interfaces de usuário interativas e eficientes.  
- **React Router**: Para o roteamento do lado do cliente, permitindo uma navegação fluida entre as páginas.

### Back-end
- **Node.js**: Um ambiente de tempo de execução JavaScript que permite a criação de servidores robustos e escaláveis.  
- **Express.js**: Um framework de aplicação web para Node.js, utilizado para construir a API RESTful.  
- **MySQL**: O sistema de gerenciamento de banco de dados utilizado para armazenar todas as informações das receitas.

---

## Funcionalidades Principais
- **Explorar Receitas**: Navegue por uma vasta coleção de receitas com fotos e detalhes.  
- **Detalhes da Receita**: Visualize informações detalhadas de cada receita, incluindo ingredientes, instruções e tempo de preparo.  
- **Criação de Receitas**: Os usuários podem adicionar suas próprias receitas à plataforma.  
- **Gerenciamento de Receitas**: Edite ou exclua suas próprias receitas.

---

## Como Executar o Projeto

### Pré-requisitos
Certifique-se de ter o **Node.js** e o **npm** (ou **Yarn**) instalados em sua máquina.

### Back-end
1. Navegue até o diretório do back-end:
  ```
   cd backend
  ````
Instale as dependências:
```
npm install
```

Crie um arquivo .env na raiz do diretório do back-end e configure as variáveis de ambiente necessárias, como a URL de conexão com o banco de dados. Exemplo:
```
PORT=5000
DATABASE_URL=sua_url_de_banco_de_dados
```
Inicie o servidor:

```
npm start
```
O servidor estará rodando em http://localhost:5000 (ou na porta que você configurou).

Front-end
Em uma nova janela do terminal, navegue até o diretório do front-end:

```
cd frontend
```
Instale as dependências:

```
npm install
```
Inicie a aplicação React:
```
npm run dev
```
A aplicação será aberta automaticamente em seu navegador padrão, geralmente em http://localhost:5173.

## Estrutura do Projeto

/backend  - Contém toda a lógica do servidor, API RESTful e conexão com o banco de dados.

/frontend - Contém toda a interface do usuário e a lógica do React.

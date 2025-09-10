# CalendarIA - Calendário de Agendamentos com IA

Este é um projeto de uma aplicação web completa de um calendário de agendamentos com funcionalidades de Inteligência Artificial. A aplicação é dividida em um frontend React e um backend Node.js/Express.

## ✨ Funcionalidades

*   **Gerenciamento de Eventos (CRUD):** Crie, leia, atualize e delete eventos.
*   **Visualização de Calendário:** Componente de calendário com navegação por mês, semana e dia.
*   **Formulário de Eventos:** Formulário dedicado para adicionar novos eventos com detalhes.
*   **Processamento de Linguagem Natural (NLP):** Adicione eventos usando linguagem natural (ex: "Reunião com João amanhã às 10h").
*   **Autenticação de Usuários:** Registro e login de usuários com proteção de rotas.
*   **Notificações por Email:** Envio de notificações por email (requer configuração).
*   **Estrutura Modular:** Projeto dividido em frontend e backend para melhor organização e escalabilidade.
*   **Testes:** Testes unitários e de integração para garantir a qualidade do código.

## 🚀 Tecnologias Utilizadas

### Frontend
*   **React:** Biblioteca JavaScript para construção de interfaces de usuário.
*   **React Router DOM:** Para roteamento na aplicação frontend.
*   **CSS:** Estilização da aplicação.

### Backend
*   **Node.js:** Ambiente de execução JavaScript.
*   **Express.js:** Framework web para Node.js.
*   **MongoDB:** Banco de dados NoSQL para persistência de dados.
*   **Chrono-node:** Biblioteca para processamento de linguagem natural (NLP).
*   **Nodemailer:** Módulo para envio de e-mails.
*   **bcryptjs:** Para hash de senhas.
*   **jsonwebtoken:** Para autenticação baseada em tokens JWT.

### Testes
*   **Mocha:** Framework de testes para JavaScript (backend).
*   **Chai:** Biblioteca de asserções para testes (backend).
*   **Jest & React Testing Library:** Para testes de componentes React (frontend).

## 📦 Estrutura do Projeto

```
.
├── backend/                 # Código do servidor Node.js/Express
│   ├── models/              # Definições de modelos de dados (Event, User)
│   ├── routes/              # Definições de rotas da API (auth, events, nlp, notifications)
│   ├── test/                # Testes de backend
│   ├── utils/               # Funções utilitárias (mailer)
│   ├── index.js             # Ponto de entrada do servidor
│   ├── package.json         # Dependências e scripts do backend
│   └── ...
├── frontend/                # Código da aplicação React
│   ├── public/              # Arquivos estáticos
│   ├── src/                 # Código fonte da aplicação React
│   │   ├── components/      # Componentes React (Calendar, EventForm, Login, Register, NaturalLanguageInput)
│   │   ├── App.js           # Componente principal da aplicação
│   │   ├── App.css          # Estilos globais da aplicação
│   │   ├── index.js         # Ponto de entrada do React
│   │   └── index.css        # Estilos globais
│   └── ...
├── GEMINI.md                # Documentação do fluxo de trabalho do Gemini
├── TODO.md                  # Lista de tarefas do projeto
└── README.md                # Este arquivo
```

## ⚙️ Como Configurar e Executar

### Pré-requisitos
*   Node.js (versão 14 ou superior)
*   npm (gerenciador de pacotes do Node.js)
*   MongoDB (instância local ou remota)

### Passos

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/carlosramonDev/calendarIA.git
    cd calendarIA
    ```

2.  **Configurar o Backend:**
    *   Navegue até o diretório `backend`:
        ```bash
        cd backend
        ```
    *   Instale as dependências:
        ```bash
        npm install
        ```
    *   **Configurar Conexão MongoDB:** Edite o arquivo `backend/config.js` e substitua `'YOUR_MONGODB_CONNECTION_STRING_HERE'` pela sua string de conexão real do MongoDB.
    *   **Configurar Email (Opcional):** Se for usar notificações por email, edite `backend/utils/mailer.js` com suas credenciais de email.
    *   **Iniciar o Servidor Backend:**
        ```bash
        node index.js
        ```
        O servidor será iniciado na porta `3001` (ou na porta definida pela variável de ambiente `PORT`).

3.  **Configurar o Frontend:**
    *   Abra um novo terminal e navegue até o diretório `frontend`:
        ```bash
        cd frontend
        ```
    *   Instale as dependências:
        ```bash
        npm install
        ```
    *   **Iniciar o Aplicativo Frontend:**
        ```bash
        npm start
        ```
        O aplicativo será iniciado na porta `3000` e abrirá automaticamente no seu navegador.

### Executando Testes

*   **Testes de Backend:**
    ```bash
    cd backend
    npm test
    ```
*   **Testes de Frontend:**
    ```bash
    cd frontend
    npm test
    ```
    (Nota: Para alguns ambientes, pode ser necessário executar `npx react-scripts test` para os testes de frontend.)

## 🚀 Deploy

Para instruções de deploy, consulte a seção "Fazer o deploy da aplicação" no arquivo `TODO.md`.
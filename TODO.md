# TODO - CalendarIA

Este é um plano de desenvolvimento para o projeto CalendarIA, um calendário de agendamento com IA.

## Fase 1: Configuração e Estrutura Base

- [ ] Configurar o ambiente de desenvolvimento local
- [x] Inicializar o projeto com um framework frontend (e.g., React, Vue)
- [x] Configurar o backend com um framework (e.g., Node.js/Express, Python/FastAPI)
- [x] Escolher e configurar um banco de dados (e.g., MongoDB, PostgreSQL)
- [x] Definir a estrutura de pastas do projeto

## Fase 2: Funcionalidades Essenciais do Calendário

- [ ] **Frontend:**
    - [x] Criar o componente de visualização do calendário (mês, semana, dia)
    - [x] Implementar a navegação entre os meses/semanas/dias
    - [x] Criar um formulário para adicionar novos eventos
    - [x] Implementar a exibição dos eventos no calendário
- [ ] **Backend:**
    - [x] Criar a API para CRUD (Create, Read, Update, Delete) de eventos
    - [x] Definir o modelo de dados para os eventos no banco de dados
    - [x] Implementar a lógica para salvar, buscar, atualizar e deletar eventos

## Fase 3: Autenticação de Usuários

- [ ] **Frontend:**
    - [x] Criar as páginas de login e registro
    - [x] Implementar o fluxo de autenticação no frontend
    - [x] Proteger as rotas que exigem autenticação
- [ ] **Backend:**
    - [x] Criar a API para registro e login de usuários
    - [x] Definir o modelo de dados para os usuários no banco de dados
    - [x] Implementar a lógica de autenticação com tokens (e.g., JWT)

## Fase 4: Integração com IA

- [ ] **Frontend:**
    - [ ] Criar um campo de input para linguagem natural (e.g., "Agendar reunião com João amanhã às 10h")
    - [ ] Enviar o texto para o backend para processamento
- [ ] **Backend:**
    - [x] Escolher um serviço de NLP (Natural Language Processing)
    - [x] Criar um endpoint na API para receber o texto em linguagem natural
    - [x] Implementar a lógica para processar o texto, extrair as informações do evento (título, data, hora, etc.) e criar o evento no banco de dados

## Fase 5: Melhorias e Refinamento

- [ ] Implementar notificações por email ou push
- [ ] Adicionar a funcionalidade de convidar outros usuários para eventos
- [ ] Melhorar a interface do usuário e a experiência do usuário (UI/UX)
- [ ] Escrever testes unitários e de integração
- [ ] Fazer o deploy da aplicação

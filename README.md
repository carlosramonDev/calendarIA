# Calendário de Agendamentos Interativo

Este é um projeto de uma aplicação web completa de um calendário de agendamentos. A aplicação é totalmente funcional no lado do cliente (client-side), utilizando o armazenamento local do navegador para persistir os dados, sem a necessidade de um backend.

## ✨ Funcionalidades

*   **Visualização de Calendário Mensal:** Navegue facilmente entre os meses.
*   **Gerenciamento de Compromissos:** Adicione, edite e exclua compromissos diretamente na interface.
*   **Interface Intuitiva:** Clique em um dia para adicionar um novo agendamento.
*   **Modais Interativos:** Pop-ups para adicionar, visualizar detalhes, e listar todos os agendamentos.
*   **Filtragem Avançada:** Filtre a lista de agendamentos por mês ou por tipo (Reunião, Consulta, Evento, Lembrete).
*   **Persistência de Dados Local:** Utiliza **SQL.js** para criar um banco de dados SQLite que roda diretamente no navegador e salva os dados no `localStorage`.
*   **Design Responsivo:** A interface se adapta a diferentes tamanhos de tela, de desktops a dispositivos móveis.

## 🚀 Como Executar

Este projeto não requer um servidor ou processo de compilação. Basta abrir o arquivo `index.html` em um navegador web moderno.

1.  Clone ou baixe este repositório.
2.  Navegue até a pasta do projeto.
3.  Abra o arquivo `index.html` no seu navegador de preferência (Google Chrome, Firefox, etc.).

Para uma melhor experiência de desenvolvimento, você pode usar uma extensão como o "Live Server" no Visual Studio Code, que irá recarregar a página automaticamente ao fazer alterações.

## 🛠️ Tecnologias Utilizadas

*   **HTML5:** Estrutura da aplicação.
*   **CSS3:** Estilização, layout (Flexbox e Grid) e animações.
*   **JavaScript (ES6+):** Lógica da aplicação, manipulação do DOM e interatividade.
*   **SQL.js:** Biblioteca que permite rodar um banco de dados SQLite totalmente no navegador.

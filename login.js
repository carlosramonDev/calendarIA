document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const formMessage = document.getElementById('formMessage');
    const resetUsersBtn = document.getElementById('resetUsers');
    const togglePassword = document.getElementById('togglePassword');

    // Se o usuário já estiver logado, redireciona para o calendário
    if (localStorage.getItem('calendar_user')) {
        window.location.href = 'index.html';
    }

    // Preenche os campos se "Lembrar-me" estiver ativo
    const rememberedUser = JSON.parse(localStorage.getItem('calendar_remembered_user'));
    if (rememberedUser) {
        usernameInput.value = rememberedUser.username;
        passwordInput.value = rememberedUser.password;
        rememberMeCheckbox.checked = true;
    }

    // Lógica para mostrar/esconder senha
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Altera o ícone
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            showMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }

        // Pega os usuários salvos do localStorage
        const users = JSON.parse(localStorage.getItem('calendar_users') || '{}');

        // Verifica se o usuário existe
        if (users[username]) {
            // Usuário existe, verifica a senha
            if (users[username] === password) {
                // Senha correta, faz o login
                loginSuccess(username, password);
            } else {
                // Senha incorreta
                showMessage('Senha incorreta. Tente novamente.', 'error');
            }
        } else {
            // Usuário não existe, cria um novo
            users[username] = password;
            localStorage.setItem('calendar_users', JSON.stringify(users));
            showMessage('Usuário criado com sucesso! Entrando...', 'success');
            
            // Aguarda um pouco para o usuário ver a mensagem e faz o login
            setTimeout(() => {
                loginSuccess(username, password);
            }, 1000);
        }
    });

    resetUsersBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja apagar todos os usuários e senhas salvos?')) {
            localStorage.removeItem('calendar_users');
            localStorage.removeItem('calendar_remembered_user'); // Limpa também o usuário lembrado
            showMessage('Todos os usuários foram removidos. Você pode criar um novo agora.', 'info');
            usernameInput.value = '';
            passwordInput.value = '';
            usernameInput.focus();
        }
    });

    function loginSuccess(username, password) {
        // Salva o usuário logado na sessão
        localStorage.setItem('calendar_user', username);

        // Gerencia a opção "Lembrar-me"
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('calendar_remembered_user', JSON.stringify({ username, password }));
        } else {
            localStorage.removeItem('calendar_remembered_user');
        }
        
        // Redireciona para a página do calendário
        window.location.href = 'index.html';
    }

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = type;
    }
});

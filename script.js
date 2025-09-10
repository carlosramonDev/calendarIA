class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.appointments = {};
        this.user = null;
        this.monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        this.init();
    }

    async init() {
        // Verifica se o usuário está logado
        this.user = localStorage.getItem('calendar_user');
        if (!this.user) {
            window.location.href = 'login.html';
            return; // Para a execução se não houver usuário
        }

        // Exibe a saudação ao usuário
        document.getElementById('userName').textContent = `Olá, ${this.user}!`;

        // Inicializa o banco de dados
        await window.calendarDB.init();
        
        this.bindEvents();
        this.bindNavigationEvents();
        this.bindModalEvents();
        await this.loadAppointments();
        this.render();
    }

    bindNavigationEvents() {
        const navLinks = document.querySelectorAll('.nav-link');
        const contentSections = document.querySelectorAll('.content-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove a classe 'active' de todos os links e seções
                navLinks.forEach(l => l.classList.remove('active'));
                contentSections.forEach(s => s.classList.remove('active'));

                // Adiciona a classe 'active' ao link clicado e à seção correspondente
                const targetId = link.dataset.target;
                link.classList.add('active');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    bindEvents() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.previousMonth();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.nextMonth();
        });

        document.getElementById('viewAppointments').addEventListener('click', () => {
            this.openAppointmentsList();
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
    }

    logout() {
        // Remove o usuário do localStorage
        localStorage.removeItem('calendar_user');
        
        // Opcional: remover também o banco de dados para limpar os dados do usuário que saiu
        // localStorage.removeItem('calendar_db');

        // Redireciona para a página de login
        window.location.href = 'login.html';
    }

    bindModalEvents() {
        const appointmentModal = document.getElementById('appointmentModal');
        const appointmentsListModal = document.getElementById('appointmentsListModal');
        const appointmentDetailsModal = document.getElementById('appointmentDetailsModal');
        
        // Eventos do modal de agendamento
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancelAppointment');
        const form = document.getElementById('appointmentForm');

        // Fechar modal de agendamento
        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        cancelBtn.addEventListener('click', () => {
            this.closeModal();
        });

        // Fechar ao clicar fora do modal
        appointmentModal.addEventListener('click', (e) => {
            if (e.target === appointmentModal) {
                this.closeModal();
            }
        });

        // Submeter formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAppointment();
        });

        // Eventos do modal de lista de agendamentos
        const listCloseBtn = appointmentsListModal.querySelector('.close');
        const filterMonth = document.getElementById('filterMonth');
        const filterType = document.getElementById('filterType');

        listCloseBtn.addEventListener('click', () => {
            this.closeAppointmentsList();
        });

        appointmentsListModal.addEventListener('click', (e) => {
            if (e.target === appointmentsListModal) {
                this.closeAppointmentsList();
            }
        });

        // Filtros
        filterMonth.addEventListener('change', () => {
            this.filterAppointments();
        });

        filterType.addEventListener('change', () => {
            this.filterAppointments();
        });

        // Eventos do modal de detalhes
        const detailsCloseBtn = appointmentDetailsModal.querySelector('.close');
        const editBtn = document.getElementById('editAppointment');
        const deleteBtn = document.getElementById('deleteAppointment');
        const closeDetailsBtn = document.getElementById('closeDetails');

        detailsCloseBtn.addEventListener('click', () => {
            this.closeAppointmentDetails();
        });

        closeDetailsBtn.addEventListener('click', () => {
            this.closeAppointmentDetails();
        });

        editBtn.addEventListener('click', () => {
            this.editAppointment();
        });

        deleteBtn.addEventListener('click', () => {
            this.deleteAppointment();
        });

        appointmentDetailsModal.addEventListener('click', (e) => {
            if (e.target === appointmentDetailsModal) {
                this.closeAppointmentDetails();
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (appointmentModal.classList.contains('show')) {
                    this.closeModal();
                } else if (appointmentsListModal.classList.contains('show')) {
                    this.closeAppointmentsList();
                } else if (appointmentDetailsModal.classList.contains('show')) {
                    this.closeAppointmentDetails();
                }
            }
        });
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }

    async loadAppointments() {
        try {
            const appointments = window.calendarDB.getAllAppointments();
            this.appointments = {};
            
            appointments.forEach(appointment => {
                this.appointments[appointment.appointment_date] = {
                    id: appointment.id,
                    title: appointment.title,
                    description: appointment.description,
                    time: appointment.appointment_time,
                    type: appointment.type,
                    date: appointment.appointment_date
                };
            });
        } catch (error) {
            console.error('Erro ao carregar agendamentos:', error);
        }
    }

    render() {
        this.updateHeader();
        this.renderDays();
    }

    updateHeader() {
        const monthYear = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        document.getElementById('currentMonth').textContent = monthYear;
    }

    renderDays() {
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        // Adiciona efeito de loading
        calendarDays.classList.add('loading');

        setTimeout(() => {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            
            // Primeiro dia do mês
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            
            // Dia da semana do primeiro dia (0 = domingo)
            const startDay = firstDay.getDay();
            
            // Número de dias no mês
            const daysInMonth = lastDay.getDate();
            
            // Número de dias do mês anterior para preencher
            const prevMonth = new Date(year, month, 0);
            const daysInPrevMonth = prevMonth.getDate();
            
            // Hoje
            const today = new Date();
            const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
            
            // Adiciona dias do mês anterior
            for (let i = startDay - 1; i >= 0; i--) {
                const day = daysInPrevMonth - i;
                const dayElement = this.createDayElement(day, true);
                calendarDays.appendChild(dayElement);
            }
            
            // Adiciona dias do mês atual
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = this.createDayElement(day, false);
                
                // Marca o dia de hoje
                if (isCurrentMonth && day === today.getDate()) {
                    dayElement.classList.add('today');
                }
                
                // Adiciona evento de clique
                dayElement.addEventListener('click', () => {
                    this.selectDate(day, month, year);
                });
                
                // Adiciona indicador se tem compromisso
                if (this.hasAppointment(day, month, year)) {
                    dayElement.classList.add('has-appointment');
                }
                
                calendarDays.appendChild(dayElement);
            }
            
            // Adiciona dias do próximo mês para completar a grade
            const remainingDays = 42 - (startDay + daysInMonth); // 6 semanas * 7 dias
            for (let day = 1; day <= remainingDays; day++) {
                const dayElement = this.createDayElement(day, true);
                calendarDays.appendChild(dayElement);
            }
            
            // Remove efeito de loading
            calendarDays.classList.remove('loading');
        }, 300);
    }

    createDayElement(day, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;
        
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }
        
        return dayElement;
    }

    selectDate(day, month, year) {
        // Remove seleção anterior
        const previousSelected = document.querySelector('.day.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        // Adiciona seleção atual
        const selectedDay = event.target;
        selectedDay.classList.add('selected');
        
        // Atualiza data selecionada
        this.selectedDate = new Date(year, month, day);
        
        // Adiciona efeito visual
        selectedDay.style.transform = 'scale(0.95)';
        setTimeout(() => {
            selectedDay.style.transform = 'scale(1)';
        }, 150);
        
        // Abre o modal de agendamento
        this.openModal(day, month, year);
        
        console.log(`Data selecionada: ${day}/${month + 1}/${year}`);
    }

    openModal(day, month, year) {
        const modal = document.getElementById('appointmentModal');
        const selectedDateText = document.getElementById('selectedDateText');
        const form = document.getElementById('appointmentForm');
        
        // Atualiza o texto da data selecionada
        const dateString = `${day} de ${this.monthNames[month]} de ${year}`;
        selectedDateText.textContent = dateString;
        
        // Limpa o formulário e remove ID de edição
        form.reset();
        delete form.dataset.appointmentId;
        
        // Define horário padrão
        document.getElementById('appointmentTime').value = '09:00';
        
        // Mostra o modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Foca no primeiro campo
        setTimeout(() => {
            document.getElementById('appointmentTitle').focus();
        }, 300);
    }

    closeModal() {
        const modal = document.getElementById('appointmentModal');
        const modalContent = modal.querySelector('.modal-content');
        
        // Adiciona animação de saída
        modal.classList.add('fade-out');
        modalContent.classList.add('slide-out');
        
        setTimeout(() => {
            modal.classList.remove('show', 'fade-out');
            modalContent.classList.remove('slide-out');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    async saveAppointment() {
        const form = document.getElementById('appointmentForm');
        const appointmentId = form.dataset.appointmentId;
        
        const appointment = {
            title: document.getElementById('appointmentTitle').value,
            time: document.getElementById('appointmentTime').value,
            description: document.getElementById('appointmentDescription').value,
            type: document.getElementById('appointmentType').value,
            date: this.selectedDate.toISOString().split('T')[0]
        };
        
        try {
            let success;
            
            if (appointmentId) {
                // Atualiza agendamento existente
                success = window.calendarDB.updateAppointment(appointmentId, appointment);
            } else {
                // Adiciona novo agendamento
                success = window.calendarDB.addAppointment(appointment);
            }
            
            if (success) {
                // Recarrega agendamentos do banco
                await this.loadAppointments();
                
                // Mostra confirmação
                const message = appointmentId ? 'Compromisso atualizado com sucesso!' : 'Compromisso salvo com sucesso!';
                this.showNotification(message, 'success');
                
                // Fecha o modal
                this.closeModal();
                
                // Atualiza o calendário para mostrar o indicador
                this.render();
            } else {
                this.showNotification('Erro ao salvar compromisso!', 'error');
            }
        } catch (error) {
            console.error('Erro ao salvar agendamento:', error);
            this.showNotification('Erro ao salvar compromisso!', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Remove notificação anterior se existir
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4ecdc4' : '#667eea'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 2000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    hasAppointment(day, month, year) {
        const dateKey = new Date(year, month, day).toISOString().split('T')[0];
        return this.appointments[dateKey] !== undefined;
    }

    // Métodos para visualização de agendamentos
    openAppointmentsList() {
        const modal = document.getElementById('appointmentsListModal');
        this.populateMonthFilter();
        this.renderAppointmentsList();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeAppointmentsList() {
        const modal = document.getElementById('appointmentsListModal');
        const modalContent = modal.querySelector('.modal-content');
        
        modal.classList.add('fade-out');
        modalContent.classList.add('slide-out');
        
        setTimeout(() => {
            modal.classList.remove('show', 'fade-out');
            modalContent.classList.remove('slide-out');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    populateMonthFilter() {
        const filterMonth = document.getElementById('filterMonth');
        const currentYear = new Date().getFullYear();
        
        // Limpa opções existentes (exceto "Todos os meses")
        filterMonth.innerHTML = '<option value="all">Todos os meses</option>';
        
        // Adiciona opções para os próximos 12 meses
        for (let i = 0; i < 12; i++) {
            const date = new Date(currentYear, new Date().getMonth() + i, 1);
            const monthYear = `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`;
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            const option = document.createElement('option');
            option.value = value;
            option.textContent = monthYear;
            filterMonth.appendChild(option);
        }
    }

    async renderAppointmentsList() {
        const appointmentsList = document.getElementById('appointmentsList');
        const noAppointments = document.getElementById('noAppointments');
        
        // Recarrega agendamentos do banco
        await this.loadAppointments();
        
        const filteredAppointments = this.getFilteredAppointments();
        
        if (filteredAppointments.length === 0) {
            appointmentsList.style.display = 'none';
            noAppointments.style.display = 'block';
            return;
        }
        
        appointmentsList.style.display = 'block';
        noAppointments.style.display = 'none';
        
        // Ordena por data
        filteredAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        appointmentsList.innerHTML = filteredAppointments.map(appointment => {
            const appointmentDate = new Date(appointment.date);
            const day = appointmentDate.getDate();
            const month = this.monthNames[appointmentDate.getMonth()];
            const year = appointmentDate.getFullYear();
            
            return `
                <div class="appointment-item ${appointment.type}" data-date="${appointment.date}" data-id="${appointment.id}">
                    <div class="appointment-header">
                        <h3 class="appointment-title">${appointment.title}</h3>
                        <span class="appointment-type">${this.getTypeLabel(appointment.type)}</span>
                    </div>
                    <div class="appointment-datetime">
                        <div class="appointment-date">
                            <span>📅</span>
                            <span>${day} de ${month} de ${year}</span>
                        </div>
                        <div class="appointment-time">
                            <span>🕐</span>
                            <span>${appointment.time}</span>
                        </div>
                    </div>
                    ${appointment.description ? `<p class="appointment-description">${appointment.description}</p>` : ''}
                </div>
            `;
        }).join('');
        
        // Adiciona eventos de clique nos itens
        appointmentsList.querySelectorAll('.appointment-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                this.showAppointmentDetailsById(id);
            });
        });
    }

    getFilteredAppointments() {
        const filterMonth = document.getElementById('filterMonth').value;
        const filterType = document.getElementById('filterType').value;
        
        let appointments = Object.values(this.appointments);
        
        // Filtro por mês
        if (filterMonth !== 'all') {
            appointments = appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.date);
                const appointmentMonth = `${appointmentDate.getFullYear()}-${String(appointmentDate.getMonth() + 1).padStart(2, '0')}`;
                return appointmentMonth === filterMonth;
            });
        }
        
        // Filtro por tipo
        if (filterType !== 'all') {
            appointments = appointments.filter(appointment => appointment.type === filterType);
        }
        
        return appointments;
    }

    filterAppointments() {
        this.renderAppointmentsList();
    }

    getTypeLabel(type) {
        const labels = {
            'meeting': 'Reunião',
            'appointment': 'Consulta',
            'event': 'Evento',
            'reminder': 'Lembrete'
        };
        return labels[type] || type;
    }

    showAppointmentDetails(date) {
        const appointment = this.appointments[date];
        if (!appointment) return;
        
        this.showAppointmentDetailsById(appointment.id);
    }

    showAppointmentDetailsById(appointmentId) {
        const modal = document.getElementById('appointmentDetailsModal');
        const detailsContainer = document.getElementById('appointmentDetails');
        
        // Busca o agendamento no banco de dados
        const appointments = window.calendarDB.getAllAppointments();
        const appointment = appointments.find(apt => apt.id == appointmentId);
        
        if (!appointment) return;
        
        const appointmentDate = new Date(appointment.appointment_date);
        const day = appointmentDate.getDate();
        const month = this.monthNames[appointmentDate.getMonth()];
        const year = appointmentDate.getFullYear();
        
        detailsContainer.innerHTML = `
            <div class="detail-row">
                <div class="detail-label">Título:</div>
                <div class="detail-value">${appointment.title}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Data:</div>
                <div class="detail-value">${day} de ${month} de ${year}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Horário:</div>
                <div class="detail-value">${appointment.appointment_time}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Tipo:</div>
                <div class="detail-value type">${this.getTypeLabel(appointment.type)}</div>
            </div>
            ${appointment.description ? `
            <div class="detail-row">
                <div class="detail-label">Descrição:</div>
                <div class="detail-value">${appointment.description}</div>
            </div>
            ` : ''}
        `;
        
        // Armazena o ID do agendamento para edição/exclusão
        modal.dataset.appointmentId = appointmentId;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeAppointmentDetails() {
        const modal = document.getElementById('appointmentDetailsModal');
        const modalContent = modal.querySelector('.modal-content');
        
        modal.classList.add('fade-out');
        modalContent.classList.add('slide-out');
        
        setTimeout(() => {
            modal.classList.remove('show', 'fade-out');
            modalContent.classList.remove('slide-out');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    async editAppointment() {
        const modal = document.getElementById('appointmentDetailsModal');
        const appointmentId = modal.dataset.appointmentId;
        
        if (!appointmentId) return;
        
        // Busca o agendamento no banco de dados
        const appointments = window.calendarDB.getAllAppointments();
        const appointment = appointments.find(apt => apt.id == appointmentId);
        
        if (!appointment) return;
        
        // Fecha o modal de detalhes
        this.closeAppointmentDetails();
        
        // Navega para a data do agendamento
        const appointmentDate = new Date(appointment.appointment_date);
        this.currentDate = new Date(appointmentDate);
        this.render();
        
        // Abre o modal de edição com os dados preenchidos
        setTimeout(() => {
            this.openModal(appointmentDate.getDate(), appointmentDate.getMonth(), appointmentDate.getFullYear());
            
            // Preenche o formulário
            document.getElementById('appointmentTitle').value = appointment.title;
            document.getElementById('appointmentTime').value = appointment.appointment_time;
            document.getElementById('appointmentDescription').value = appointment.description;
            document.getElementById('appointmentType').value = appointment.type;
            
            // Armazena o ID para atualização
            document.getElementById('appointmentForm').dataset.appointmentId = appointmentId;
        }, 500);
    }

    async deleteAppointment() {
        const modal = document.getElementById('appointmentDetailsModal');
        const appointmentId = modal.dataset.appointmentId;
        
        if (!appointmentId) return;
        
        if (confirm('Tem certeza que deseja excluir este agendamento?')) {
            try {
                const success = window.calendarDB.deleteAppointment(appointmentId);
                
                if (success) {
                    // Recarrega agendamentos
                    await this.loadAppointments();
                    
                    this.showNotification('Agendamento excluído com sucesso!', 'success');
                    this.closeAppointmentDetails();
                    this.render(); // Atualiza o calendário
                } else {
                    this.showNotification('Erro ao excluir agendamento!', 'error');
                }
            } catch (error) {
                console.error('Erro ao excluir agendamento:', error);
                this.showNotification('Erro ao excluir agendamento!', 'error');
            }
        }
    }
}

// Inicializa o calendário quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    window.calendarInstance = new Calendar();
});

// Adiciona funcionalidade de teclado
document.addEventListener('keydown', (e) => {
    const calendar = window.calendarInstance;
    if (!calendar) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            calendar.previousMonth();
            break;
        case 'ArrowRight':
            calendar.nextMonth();
            break;
        case 'Escape':
            // Remove seleção
            const selected = document.querySelector('.day.selected');
            if (selected) {
                selected.classList.remove('selected');
            }
            break;
    }
});

// Adiciona suporte a touch para dispositivos móveis
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe para a esquerda - próximo mês
            document.getElementById('nextMonth').click();
        } else {
            // Swipe para a direita - mês anterior
            document.getElementById('prevMonth').click();
        }
    }
}

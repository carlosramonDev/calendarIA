class CalendarDatabase {
    constructor() {
        this.db = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            // Inicializa SQL.js
            const SQL = await initSqlJs({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
            });

            // Carrega dados existentes do localStorage ou cria novo banco
            const savedData = localStorage.getItem('calendar_db');
            if (savedData) {
                const data = new Uint8Array(JSON.parse(savedData));
                this.db = new SQL.Database(data);
            } else {
                this.db = new SQL.Database();
            }

            // Cria as tabelas se não existirem
            this.createTables();
            this.isInitialized = true;
            
            console.log('Banco de dados SQLite inicializado com sucesso!');
        } catch (error) {
            console.error('Erro ao inicializar banco de dados:', error);
            // Fallback para localStorage se SQLite falhar
            this.isInitialized = false;
        }
    }

    createTables() {
        const createAppointmentsTable = `
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                appointment_date TEXT NOT NULL,
                appointment_time TEXT NOT NULL,
                type TEXT NOT NULL DEFAULT 'meeting',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createIndex = `
            CREATE INDEX IF NOT EXISTS idx_appointment_date 
            ON appointments(appointment_date)
        `;

        try {
            this.db.exec(createAppointmentsTable);
            this.db.exec(createIndex);
            console.log('Tabelas criadas com sucesso!');
        } catch (error) {
            console.error('Erro ao criar tabelas:', error);
        }
    }

    // Salva o banco no localStorage
    saveDatabase() {
        if (this.db && this.isInitialized) {
            try {
                const data = this.db.export();
                localStorage.setItem('calendar_db', JSON.stringify(Array.from(data)));
            } catch (error) {
                console.error('Erro ao salvar banco de dados:', error);
            }
        }
    }

    // Adiciona um novo agendamento
    addAppointment(appointment) {
        if (!this.isInitialized) {
            return this.fallbackAddAppointment(appointment);
        }

        try {
            const stmt = this.db.prepare(`
                INSERT INTO appointments (title, description, appointment_date, appointment_time, type)
                VALUES (?, ?, ?, ?, ?)
            `);
            
            stmt.run([
                appointment.title,
                appointment.description || '',
                appointment.date,
                appointment.time,
                appointment.type
            ]);
            
            stmt.free();
            this.saveDatabase();
            
            console.log('Agendamento adicionado com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao adicionar agendamento:', error);
            return this.fallbackAddAppointment(appointment);
        }
    }

    // Atualiza um agendamento existente
    updateAppointment(appointmentId, appointment) {
        if (!this.isInitialized) {
            return this.fallbackUpdateAppointment(appointmentId, appointment);
        }

        try {
            const stmt = this.db.prepare(`
                UPDATE appointments 
                SET title = ?, description = ?, appointment_date = ?, 
                    appointment_time = ?, type = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `);
            
            stmt.run([
                appointment.title,
                appointment.description || '',
                appointment.date,
                appointment.time,
                appointment.type,
                appointmentId
            ]);
            
            stmt.free();
            this.saveDatabase();
            
            console.log('Agendamento atualizado com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao atualizar agendamento:', error);
            return this.fallbackUpdateAppointment(appointmentId, appointment);
        }
    }

    // Remove um agendamento
    deleteAppointment(appointmentId) {
        if (!this.isInitialized) {
            return this.fallbackDeleteAppointment(appointmentId);
        }

        try {
            const stmt = this.db.prepare('DELETE FROM appointments WHERE id = ?');
            stmt.run([appointmentId]);
            stmt.free();
            this.saveDatabase();
            
            console.log('Agendamento removido com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao remover agendamento:', error);
            return this.fallbackDeleteAppointment(appointmentId);
        }
    }

    // Busca agendamentos por data
    getAppointmentsByDate(date) {
        if (!this.isInitialized) {
            return this.fallbackGetAppointmentsByDate(date);
        }

        try {
            const stmt = this.db.prepare(`
                SELECT * FROM appointments 
                WHERE appointment_date = ? 
                ORDER BY appointment_time ASC
            `);
            
            const result = stmt.getAsObject({ appointment_date: date });
            stmt.free();
            
            return result ? [result] : [];
        } catch (error) {
            console.error('Erro ao buscar agendamentos por data:', error);
            return this.fallbackGetAppointmentsByDate(date);
        }
    }

    // Busca todos os agendamentos
    getAllAppointments() {
        if (!this.isInitialized) {
            return this.fallbackGetAllAppointments();
        }

        try {
            const stmt = this.db.prepare(`
                SELECT * FROM appointments 
                ORDER BY appointment_date ASC, appointment_time ASC
            `);
            
            const result = [];
            while (stmt.step()) {
                result.push(stmt.getAsObject());
            }
            stmt.free();
            
            return result;
        } catch (error) {
            console.error('Erro ao buscar todos os agendamentos:', error);
            return this.fallbackGetAllAppointments();
        }
    }

    // Busca agendamentos por período
    getAppointmentsByDateRange(startDate, endDate) {
        if (!this.isInitialized) {
            return this.fallbackGetAppointmentsByDateRange(startDate, endDate);
        }

        try {
            const stmt = this.db.prepare(`
                SELECT * FROM appointments 
                WHERE appointment_date BETWEEN ? AND ?
                ORDER BY appointment_date ASC, appointment_time ASC
            `);
            
            const result = [];
            while (stmt.step()) {
                result.push(stmt.getAsObject());
            }
            stmt.free();
            
            return result;
        } catch (error) {
            console.error('Erro ao buscar agendamentos por período:', error);
            return this.fallbackGetAppointmentsByDateRange(startDate, endDate);
        }
    }

    // Busca agendamentos por tipo
    getAppointmentsByType(type) {
        if (!this.isInitialized) {
            return this.fallbackGetAppointmentsByType(type);
        }

        try {
            const stmt = this.db.prepare(`
                SELECT * FROM appointments 
                WHERE type = ?
                ORDER BY appointment_date ASC, appointment_time ASC
            `);
            
            const result = [];
            while (stmt.step()) {
                result.push(stmt.getAsObject());
            }
            stmt.free();
            
            return result;
        } catch (error) {
            console.error('Erro ao buscar agendamentos por tipo:', error);
            return this.fallbackGetAppointmentsByType(type);
        }
    }

    // Métodos de fallback para localStorage
    fallbackAddAppointment(appointment) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '{}');
        const id = Date.now().toString();
        appointments[appointment.date] = { ...appointment, id };
        localStorage.setItem('appointments', JSON.stringify(appointments));
        return true;
    }

    fallbackUpdateAppointment(appointmentId, appointment) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '{}');
        for (const [date, apt] of Object.entries(appointments)) {
            if (apt.id === appointmentId) {
                appointments[date] = { ...appointment, id: appointmentId };
                break;
            }
        }
        localStorage.setItem('appointments', JSON.stringify(appointments));
        return true;
    }

    fallbackDeleteAppointment(appointmentId) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '{}');
        for (const [date, apt] of Object.entries(appointments)) {
            if (apt.id === appointmentId) {
                delete appointments[date];
                break;
            }
        }
        localStorage.setItem('appointments', JSON.stringify(appointments));
        return true;
    }

    fallbackGetAppointmentsByDate(date) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '{}');
        return appointments[date] ? [appointments[date]] : [];
    }

    fallbackGetAllAppointments() {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '{}');
        return Object.values(appointments);
    }

    fallbackGetAppointmentsByDateRange(startDate, endDate) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '{}');
        return Object.values(appointments).filter(apt => 
            apt.date >= startDate && apt.date <= endDate
        );
    }

    fallbackGetAppointmentsByType(type) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '{}');
        return Object.values(appointments).filter(apt => apt.type === type);
    }

    // Exporta dados do banco
    exportDatabase() {
        if (this.db && this.isInitialized) {
            const data = this.db.export();
            const blob = new Blob([data], { type: 'application/x-sqlite3' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'calendar_backup.db';
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    // Importa dados para o banco
    async importDatabase(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            
            const SQL = await initSqlJs({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
            });
            
            this.db = new SQL.Database(data);
            this.createTables();
            this.saveDatabase();
            
            console.log('Banco de dados importado com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao importar banco de dados:', error);
            return false;
        }
    }
}

// Instância global do banco de dados
window.calendarDB = new CalendarDatabase();


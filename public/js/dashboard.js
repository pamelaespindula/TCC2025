document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar');
    const agendamentoListaEl = document.getElementById('listaAgendamentos');
    const dataSelecionadaEl = document.getElementById('dataSelecionada');
    const btnNovoAgendamento = document.getElementById('btnNovoAgendamento');
    const modal = document.getElementById('modalAgendamento');
    const btnCancelar = document.getElementById('btnCancelar');
    const formAgendamento = document.getElementById('formAgendamento');

    let dataSelecionada = null;
    const hoje = new Date();
    let ano = hoje.getFullYear();
    let mes = hoje.getMonth();

    function diasNoMes(ano, mes) {
        return new Date(ano, mes + 1, 0).getDate();
    }

    // Busca agendamentos para a data selecionada via API
    async function fetchAgendamentos(data) {
        try {
            const response = await fetch(`/agendamentos/${data}`);
            if (response.ok) {
                const agendamentos = await response.json();
                return agendamentos;
            }
            return [];
        } catch {
            return [];
        }
    }

    async function renderListaAgendamentos() {
        agendamentoListaEl.innerHTML = '';
        if (!dataSelecionada) {
            dataSelecionadaEl.textContent = 'Selecione um dia';
            return;
        }
        const agsDoDia = await fetchAgendamentos(dataSelecionada);

        if (agsDoDia.length === 0) {
            agendamentoListaEl.innerHTML = '<li>Não há agendamentos para esse dia.</li>';
            return;
        }

        agsDoDia.forEach(a => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${a.nome_servico}</strong> às ${a.hora_agendada}<br/>${a.observacoes || ''}`;
            agendamentoListaEl.appendChild(li);
        });
    }


    function renderCalendar() {
        calendarEl.innerHTML = '';

        const totalDias = diasNoMes(ano, mes);
        const primeiroDia = new Date(ano, mes, 1).getDay();

        for (let i = 0; i < primeiroDia; i++) {
            const vazio = document.createElement('div');
            calendarEl.appendChild(vazio);
        }

        // Para marcar dias com agendamento, faz fetch para todo mês (aqui para simplificar não implementado, pode melhorar depois)

        for (let dia = 1; dia <= totalDias; dia++) {
            const diaEl = document.createElement('div');
            diaEl.classList.add('dia');
            const dataFormatada = `${ano}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
            diaEl.textContent = dia;

            // Destaque o dia selecionado
            if (dataSelecionada === dataFormatada) {
                diaEl.classList.add('selecionado');
            }

            diaEl.addEventListener('click', async () => {
                dataSelecionada = dataFormatada;
                dataSelecionadaEl.textContent = diaEl.textContent + '/' + String(mes+1).padStart(2,'0') + '/' + ano;
                renderCalendar();
                await renderListaAgendamentos();
            });

            calendarEl.appendChild(diaEl);
        }
    }


    btnNovoAgendamento.addEventListener('click', () => {
        if (!dataSelecionada) {
            alert('Selecione uma data no calendário para agendar.');
            return;
        }
        modal.classList.remove('hidden');
        formAgendamento.data.value = dataSelecionada;
    });


    btnCancelar.addEventListener('click', () => {
        modal.classList.add('hidden');
        formAgendamento.reset();
    });


    formAgendamento.addEventListener('submit', async (e) => {
        e.preventDefault();
        const servico_id = formAgendamento.servico.value; // Atenção: valor deve ser id do serviço (ajuste conforme sua lista de serviços)
        const data_agendada = formAgendamento.data.value;
        const hora_agendada = formAgendamento.hora.value;
        const observacoes = formAgendamento.observacoes.value;

        try {
            const response = await fetch('/agendamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ servico_id, data_agendada, hora_agendada, observacoes })
            });
            if (response.ok) {
                modal.classList.add('hidden');
                formAgendamento.reset();
                dataSelecionada = data_agendada;
                renderCalendar();
                await renderListaAgendamentos();
            }
            else {
                alert('Erro ao salvar agendamento');
            }
        }
        catch {
            alert('Erro ao salvar agendamento');
        }
    });


    // Inicialização
    renderCalendar();
});

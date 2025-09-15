const AgendamentoModel = require('../models/agendamentosModel');

exports.cadastrarAgendamento = async (req, res) => {
  try {
    const id = await AgendamentoModel.criar(req.body);
    res.status(201).json({ message: 'Agendamento criado com sucesso', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao salvar agendamento' });
  }
};

exports.listarAgendamentosPorData = async (req, res) => {
  try {
    const data = req.params.data;
    const agendamentos = await AgendamentoModel.listarPorData(data);
    res.json(agendamentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar agendamentos' });
  }
};

const express = require('express');
const router = express.Router();
const agendamentosController = require('../controllers/agendamentosController');

router.post('/', agendamentosController.cadastrarAgendamento);
router.get('/:data', agendamentosController.listarAgendamentosPorData);

module.exports = router;

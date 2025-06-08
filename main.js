
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { Sequelize, DataTypes, Op } = require('sequelize');


const sequelize = new Sequelize({ dialect: 'sqlite', storage: './database.sqlite' });

const Plano = sequelize.define('Plano', {
  nome: DataTypes.STRING,
  validade: DataTypes.DATE,
  limite: DataTypes.FLOAT
});

const Paciente = sequelize.define('Paciente', {
  nome: DataTypes.STRING,
  telefone: DataTypes.STRING,
  email: DataTypes.STRING,
  cpf: DataTypes.STRING,
  dataNascimento: DataTypes.DATE
});

const Medico = sequelize.define('Medico', {
  nome: DataTypes.STRING,
  especialidade: DataTypes.STRING,
  crm: DataTypes.STRING
});

const Consulta = sequelize.define('Consulta', {
  data: DataTypes.DATE,
  valor: DataTypes.FLOAT
});

Plano.hasMany(Paciente);
Paciente.belongsTo(Plano);

Paciente.hasMany(Consulta);
Consulta.belongsTo(Paciente);

Medico.hasMany(Consulta);
Consulta.belongsTo(Medico);

app.use(bodyParser.json());


app.post('/pacientes', async (req, res) => {
  const paciente = await Paciente.create(req.body);
  res.json(paciente);
});

app.post('/medicos', async (req, res) => {
  const medico = await Medico.create(req.body);
  res.json(medico);
});


app.post('/planos', async (req, res) => {
  const plano = await Plano.create(req.body);
  res.json(plano);
});


app.post('/consultas', async (req, res) => {
  const paciente = await Paciente.findByPk(req.body.PacienteId, { include: Plano });
  const hoje = new Date();

  if (!paciente || new Date(paciente.Plano.validade) < hoje) {
    return res.status(400).json({ erro: 'Plano de saúde inválido.' });
  }

  const consulta = await Consulta.create(req.body);
  res.json(consulta);
});

app.get('/consultas', async (req, res) => {
  const consultas = await Consulta.findAll({ include: [Paciente, Medico] });
  res.json(consultas);
});

app.get('/consultas/resumo-financeiro', async (req, res) => {
  const consultas = await Consulta.findAll();
  const resumo = consultas.reduce((acc, c) => {
    const mes = new Date(c.data).toISOString().slice(0, 7);
    acc[mes] = (acc[mes] || 0) + c.valor;
    return acc;
  }, {});
  res.json(resumo);
});

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });
});

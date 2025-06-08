
-- Criação das Tabelas
CREATE TABLE Plano (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  validade DATE,
  limite FLOAT
);

CREATE TABLE Paciente (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  telefone TEXT,
  email TEXT,
  cpf TEXT,
  dataNascimento DATE,
  PlanoId INTEGER,
  FOREIGN KEY (PlanoId) REFERENCES Plano(id)
);

CREATE TABLE Medico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  especialidade TEXT,
  crm TEXT
);

CREATE TABLE Consulta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data DATE,
  valor FLOAT,
  PacienteId INTEGER,
  MedicoId INTEGER,
  FOREIGN KEY (PacienteId) REFERENCES Paciente(id),
  FOREIGN KEY (MedicoId) REFERENCES Medico(id)
);

-- Inserção de Dados Iniciais
INSERT INTO Plano (nome, validade, limite) VALUES ('Plano Ouro', '2025-12-31', 500.00);
INSERT INTO Paciente (nome, telefone, email, cpf, dataNascimento, PlanoId) VALUES ('João Silva', '11999999999', 'joao@email.com', '12345678900', '1990-01-01', 1);
INSERT INTO Medico (nome, especialidade, crm) VALUES ('Dra. Maria', 'Cardiologia', '12345');
INSERT INTO Consulta (data, valor, PacienteId, MedicoId) VALUES ('2025-06-10', 200.00, 1, 1);

-- Consulta de agendamentos com plano válido
SELECT Paciente.nome, Consulta.data, Plano.nome AS plano
FROM Consulta
JOIN Paciente ON Consulta.PacienteId = Paciente.id
JOIN Plano ON Paciente.PlanoId = Plano.id
WHERE Plano.validade >= DATE('now');

-- Resumo financeiro por mês
SELECT strftime('%Y-%m', data) AS mes, SUM(valor) AS total
FROM Consulta
GROUP BY mes;

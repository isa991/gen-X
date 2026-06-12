create database Hospital;
use Hospital;

create table Medico(
  crm varchar(10) primary key,
  email_medico varchar(30),
  senha varchar(50)
);

create table Paciente(
  CPF_Paciente varchar(11) primary key not null,
  nome varchar(50),
  data_de_nascimento date,
  sexo varchar(15),
  foto_do_paciente varchar(255)
);

create table Responsavel(
  CPF_Responsavel varchar(11) primary key not null,
  nome varchar(50),
  data_de_nascimento date,
  sexo varchar(50),
  telefone varchar(20)
);

create table ListadeSintomas(
  id_sintoma int primary key AUTO_INCREMENT,
  sintoma varchar(50),
  peso_masc int,
  peso_fem int
);

create table historico_de_consulta (
  id_consulta int primary key AUTO_INCREMENT,
  data_de_consulta date,
  CPF_Paciente varchar(11),
  CPF_Responsavel varchar(11),
  id_medico int,
  score_do_paciente int,
  sintomas varchar(250),
  score_risco int,
  FOREIGN KEY (CPF_Paciente) REFERENCES Paciente(CPF_Paciente),
  FOREIGN KEY (CPF_Responsavel) REFERENCES Responsavel(CPF_Responsavel),
  FOREIGN KEY (id_medico) REFERENCES Medico(id_medico)
	
);

INSERT INTO ListadeSintomas (sintoma, peso_masc, peso_fem) VALUES
("Deficiência intelectual", 32, 20),
("Face alongada/orelhas", 29, 9),
("Macroorquidismo", 26, 0),
("Hipermobilidade articular", 19, 4),
("Dificuldades de aprendizagem", 18, 28),
("Déficit de atenção", 17, 12),
("Mov. repetitivos", 17, 5),
("Atraso na fala", 14, 1),
("Hiperatividade", 12, 4),
("Evita contato visual", 6, 8),
("Evita contato físico", 4, 7),
("Agressividade", 1, 2);

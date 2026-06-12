# Gen-X

Aplicação web médica para avaliação da **Síndrome do X Frágil**. A partir dos sintomas informados durante a consulta, o sistema calcula um score de risco e auxilia médicos na tomada de decisão sobre a necessidade de encaminhar o paciente para exame diagnóstico.

> Trabalho desenvolvido para a disciplina de **Experiência Criativa: Criando Soluções Computacionais** — Bacharelado em Ciência da Computação, Pontifícia Universidade Católica do Paraná (PUCPR), campus Curitiba.

---

## Sobre o projeto

A Síndrome do X Frágil é a causa hereditária mais comum de deficiência intelectual. O gen-X digitaliza o fluxo de triagem clínica: o médico registra os sintomas observados no paciente e o sistema calcula automaticamente um score ponderado por sexo, indicando se o encaminhamento para exame genético é recomendado.

### Algoritmo de scoring

Cada sintoma possui um peso diferente para pacientes do sexo masculino e feminino. O score final é a soma dos pesos dos sintomas marcados dividida por 100. Os limiares de recomendação de exame são:

| Sexo      | Limiar |
| --------- | ------ |
| Masculino | ≥ 0.56 |
| Feminino  | ≥ 0.55 |

**Sintomas avaliados e seus pesos:**

| Sintoma                      | Peso (M) | Peso (F) |
| ---------------------------- | -------- | -------- |
| Deficiência intelectual      | 32       | 20       |
| Face alongada/orelhas        | 29       | 9        |
| Macroorquidismo              | 26       | 0        |
| Hipermobilidade articular    | 19       | 4        |
| Dificuldades de aprendizagem | 18       | 28       |
| Déficit de atenção           | 17       | 12       |
| Movimentos repetitivos       | 17       | 5        |
| Atraso na fala               | 14       | 1        |
| Hiperatividade               | 12       | 4        |
| Evita contato visual         | 6        | 8        |
| Evita contato físico         | 4        | 7        |
| Agressividade                | 1        | 2        |

---

## Arquitetura

O projeto é dividido em três camadas:

```
gen-X/
├── Backend/      # API REST em Django + Django REST Framework
├── Frontend/     # Interface web em Next.js
└── Database/     # Configuração do banco de dados MySQL via Docker
```

### Stack tecnológica

| Camada                        | Tecnologia                                     |
| ----------------------------- | ---------------------------------------------- |
| Frontend                      | Next.js 16, React 19, Tailwind CSS 4, Recharts |
| Backend                       | Python, Django, Django REST Framework          |
| Banco de dados                | MySQL                                          |
| Gerenciador de pacotes Python | [uv](https://docs.astral.sh/uv/)               |
| Containerização do banco      | Docker / Docker Compose                        |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão compatível com Next.js 16)
- [Python](https://www.python.org/) (versão definida em `.python-version`)
- [uv](https://docs.astral.sh/uv/getting-started/installation/) — gerenciador de pacotes Python
- [Docker](https://www.docker.com/) e Docker Compose

---

## Como rodar

### 1. Banco de dados

```sh
cd Database
docker compose up -d
```

Para inspecionar o banco durante o desenvolvimento:

```sh
docker exec -it mysql-container mysql -u root -p Hospital
```

### 2. Backend

```sh
cd Backend
uv run manage.py runserver
```

Caso haja mudanças nos modelos (`api/models.py`), aplique as migrações antes:

```sh
uv run manage.py makemigrations
uv run manage.py migrate
```

O backend ficará disponível em `http://localhost:8000`.

### 3. Frontend

```sh
cd Frontend
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

---

## API — Endpoints

A API base está prefixada em `/api/`.

### Autenticação

| Método | Rota                  | Descrição                 | Permissão   |
| ------ | --------------------- | ------------------------- | ----------- |
| `POST` | `/api/auth/register/` | Registra novo usuário     | Pública     |
| `POST` | `/api/auth/login/`    | Autentica e retorna token | Pública     |
| `POST` | `/api/auth/logout/`   | Invalida o token          | Autenticado |

A autenticação é feita via **Token** no header `Authorization: Token <token>`.

### Pacientes e consultas

| Método | Rota                                    | Descrição                    | Permissão |
| ------ | --------------------------------------- | ---------------------------- | --------- |
| `GET`  | `/api/get-pacientes/`                   | Lista todos os pacientes     | Médico    |
| `POST` | `/api/cadastro-paciente/`               | Cadastra novo paciente       | Médico    |
| `GET`  | `/api/get-responsaveis/`                | Lista responsáveis           | Médico    |
| `POST` | `/api/cadastro-responsavel/`            | Cadastra responsável         | Médico    |
| `GET`  | `/api/get-historico-de-consulta/`       | Lista histórico de consultas | Médico    |
| `POST` | `/api/adicionar-historico-de-consulta/` | Registra consulta com score  | Médico    |
| `GET`  | `/api/sintomas/`                        | Lista sintomas com pesos     | Médico    |
| `GET`  | `/api/medico/?crm=<crm>`                | Busca médico por CRM         | Médico    |

### Permissões

| Role     | Acesso                                               |
| -------- | ---------------------------------------------------- |
| `medico` | Leitura e escrita de pacientes, consultas e sintomas |
| `admin`  | Tudo acima + cadastro de médicos e sintomas          |

---

## Modelos de dados

```
Usuario         — usuário do sistema (médico ou admin), estende AbstractUser
Medico          — dados do médico (CRM, e-mail)
Paciente        — dados do paciente (CPF como PK, nome, nascimento, sexo, foto)
Responsavel     — responsável pelo paciente (CPF como PK, nome, telefone)
ListadeSintomas — sintoma com pesos por sexo (peso_masc, peso_fem)
historico_de_consulta — registro de consulta com sintomas, score e FKs
```

---

## Telas do Frontend

| Rota                              | Descrição                                    |
| --------------------------------- | -------------------------------------------- |
| `/`                               | Página inicial                               |
| `/login`                          | Login de usuários                            |
| `/atendimento`                    | Registro de nova consulta / atendimento      |
| `/dashboard`                      | Painel com estatísticas e contagem de riscos |
| `/pacientes`                      | Lista de pacientes                           |
| `/pacientes/[cpf]`                | Ficha do paciente                            |
| `/pacientes/[cpf]/editar`         | Edição dos dados do paciente                 |
| `/pacientes/[cpf]/relatorio/[id]` | Relatório de consulta                        |
| `/pacientes/[cpf]/resultado/[id]` | Resultado do scoring                         |
| `/pacientes/[cpf]/score/[id]`     | Detalhes do score                            |
| `/relatorio`                      | Listagem geral de relatórios                 |
| `/configuracoes`                  | Configurações da conta                       |

---

## Variáveis de ambiente

Configure as seguintes variáveis no backend (arquivo `projeto/settings.py` ou variável de ambiente) antes de subir em produção:

| Variável      | Valor padrão | Descrição           |
| ------------- | ------------ | ------------------- |
| `DB_NAME`     | `Hospital`   | Nome do banco MySQL |
| `DB_USER`     | `root`       | Usuário do banco    |
| `DB_PASSWORD` | `senha`      | Senha do banco      |
| `DB_HOST`     | `localhost`  | Host do banco       |
| `DB_PORT`     | `3306`       | Porta do banco      |

> **Atenção:** Não suba credenciais reais para o repositório. Use variáveis de ambiente ou um arquivo `.env` (já listado no `.gitignore`).

---

## Licença

O projeto utiliza a licença MIT. Para mais informações, acesse o documento LICENSE.

Todos os direitos reservados.

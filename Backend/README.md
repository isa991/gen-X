# Gen-X Backend

Pre Alpha versão 0.1 do backend pro projeto Gen X pro trabalho de experiencia criativa

## Como rodar

### Database (testes)

Para testes foi utilizado docker para rodar um servidor mysql

```sh
cd ../database
# debug foi feito com servidor MySQL rodando em container do Docker 
docker compose up -d
# se precisar inspecionar o banco de dados
docker exec -it mysql-container mysql -u root -p Hospital
```

### Backend
```sh
cd Backend
# Installe o uv em https://docs.astral.sh/uv/getting-started/installation/
uv run manage.py runserver
```

Se houver qualquer atualização na estrutura da base de dados (no caso `api/models.py`):
```sh
uv run manage.py makemigrations
uv run manage.py migrate
```

## Como acessar

http://localhost:3000
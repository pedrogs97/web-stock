# WebStock

Aplicativo do desafio Caffeine Army para controle de estoque

## Como executar

Para executar o aplicativo basta executar os comandos:

- docker-compose up -d
- docker-compose exec web-stock npx prisma migrate dev *(Este comodando só deve ser executado após a inicialização dos containers)*

Após execução dos comandos, pode ser acessado pelo link: http://localhost:3000/

## Arquivo .env

As varáveis de ambiente necessárias no arquivo `.env` são:
```
POSTGRES_DB=[name_db]
POSTGRES_USER=[user_db]
POSTGRES_PASSWORD=[pass_db]

DATABASE_URL="postgresql://[user_db]:[pass_db]@postgres:5432/[name_db]"
```

# Adonis RSXP API

Estudo do framework AdonisJS com TDD.

## :hammer: Configurar a aplicação:

- O SGDB desta aplicação é o PostgreSQL, para isso, basta executar em seu terminal o seguinte comando: `sudo docker run --name rsxp-pg -p 5432:5432 -e POSTGRES_USER=docker -e POSTGRES_PASS=mysecretpassword -d -t kartoza/postgis`. Este comando será responsável por levantar um container docker todo configurado para o uso do PostgreSQL. O banco PG do Kartoza é modificado para suportar algumas funcionalidades que não são possíveis no original, como por exemplo o UUID.

- Copie o arquivo `.env.example` e renomeie a cópia para `.env.`. Após isso, preencha as informações necessárias dele.

- Execute o comando `yarn` para instalar todas as dependências necessárias do projeto.

- Execute o comando `adonis key:generate` para gerar `APP_KEY` no arquivo `.env`. Este será usado por exemplo para gerar os hash das senhas dos usuários.

- Para rodar as migrations, execute `adonis migration:run`. **Certifique-se de que o PostgreSQL esteja configurado e iniciado**.

---

## :horse_racing: Iniciar a aplicação:

- Execute `adonis serve --dev` para levantar a API.

---

## :dart: Rotas da API:

- Para verificar as rotas disponíveis desta api, execute no terminal `adonis route:list`.

---

## :package: Importar configurações do Insomnia

[![Clique aqui para configurar o Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=RSXP-API&uri=https%3A%2F%2Fgithub.com%2Ffnoquiq%2Frsxp-api%2Fblob%2Fmaster%2Finsomnia.json)

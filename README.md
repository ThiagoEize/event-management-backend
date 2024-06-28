## Descrição

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Instalação

```bash
$ npm install
```

## Criando o banco

## Crie o .env com seguinte conteudo

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/mydatabase?schema=public"
```

## Execute os docker containers

```bash
$ docker-compose up -d
```

## Gere o cliente do prisma

```bash
$ npx prisma generate
```

## Execute as migrações

```bash
$ npx prisma migrate dev --name init
```

## Executando o backend

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Thiago Oss Emer Eizerik](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

<p align="center">
  <a href="https://github.com/ElisPerez/teslo-shop-nestjs" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo API with NestJS

# Pasos:

1. Installation

```bash
$ yarn install
```

2. Configurar variables de entorno.
   - Clonar el archivo `.env.template` y renombrarlo a `.env`

3. Levantar DB PostgreSQL con docker-compose

```
docker-compose up -d
```

4. Running the app

```bash
# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

# DTO: Data Transfer Object
  - Es una `class` que nos dice como luce nuestra data (tipo interface) pero con el plus de que podemos agregarle todas las validaciones a cada propiedad que tenga la clase.
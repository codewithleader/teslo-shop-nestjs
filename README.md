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

# Modulos
  - Agrupan y desacoplan la funcionalidad de un dominio determinado.

# Servicios
  - Todos los servicios son Providers pero no todos los Providers son Servicios.
  - Alojan la lógica de negocio de tal manera que sea reutilizable mediante inyección de dependencias.

# Entity
  - Es el model, schema o como luce nuestra data en la DB. En ella especificamos las propiedades de un objeto en una DB.

# DTO: Data Transfer Object
  - Es una `class` que nos dice como debe lucir la data recibida en la creación o actualización de una `Entity`. Es como una interface pero con el plus de que podemos agregarle todas las validaciones a cada propiedad que tenga la clase.

# TypeORM
  - ORM: Object–Relational Mapping (ORM, O/RM, and O/R mapping tool) in computer science is a programming technique for converting data between a relational database and the heap of an object-oriented programming language. This creates, in effect, a virtual object database that can be used from within the programming language.
  - TypeORM is an ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8). Its goal is to always support the latest JavaScript features and provide additional features that help you to develop any kind of application that uses databases - from small applications with a few tables to large scale enterprise applications with multiple databases.
  - Link: [https://typeorm.io/](https://typeorm.io/)
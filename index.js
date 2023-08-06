// Importação das bibliotecas
import express from "express";
import { randomUUID } from "node:crypto";

// Criação do Aplicativo com o Express
const app = express();

// É um Middleware do Express para verificar se o corpo das requisições são JSON
app.use(express.json());

// É a porta (8080) que será "ouvida" quando a aplicação estiver rodando
app.listen(8080, () => console.log("Running server."));

// Armazenando os usuários criado no método POST
let users = [];

// Middleware para verificar se o usuário existe pelo ID
const checkUserExists = (request, response, next) => {
  const { id } = request.params;

  // Achar a posição do usuário pelo ID
  const index = users.findIndex((user) => user.id === id);

  // Validação se o usuário não existir
  if (index === -1) {
    return response.status(404).json({ error: "user not found." });
  }

  next();
};

// Rota para buscar todos os usuários
app.get("/users", (request, response) => {
  return response.status(200).json(users);
});

// Rota para buscar apenas um usuário pelo ID
app.get("/users/:id", checkUserExists, (request, response) => {
  const { id } = request.params;

  // Encontrar o usuário pelo ID
  const user = users.find((user) => user.id === id);

  return response.status(200).json(user);
});

// Rota para criar um usuários
app.post("/users", (request, response) => {
  const { name, age, gender } = request.body;

  const user = {
    id: randomUUID(),
    name,
    age,
    gender,
  };

  users.push(user);

  return response.status(201).json(user);
});

// Rota para atualizar um usuários
app.put("/users/:id", checkUserExists, (request, response) => {
  const { name, age, gender } = request.body;

  const { id } = request.params;

  const index = users.findIndex((user) => user.id === id);

  const updateUserInfo = { id, name, age, gender };

  users[index] = updateUserInfo;

  return response.status(200).json(updateUserInfo);
});

// Rota para deletar um usuários
app.delete("/users/:id", checkUserExists, (request, response) => {
  const { id } = request.params;

  const index = users.findIndex((user) => user.id === id);

  users.splice(index, 1);

  return response.status(204).json();
});

/* 
TO DO

- Rota para buscar apenas um usuário pelo ID (GET /users/:id)
- Rota para atualizar apenas a senha de um usuário pelo ID (PATCH /users/:id)
- Na criação deve aceitar e-mail e senha, também
  - E-mail deve ser único, sendo assim, se tentar registrar com um já existente deve retornar um erro
*/
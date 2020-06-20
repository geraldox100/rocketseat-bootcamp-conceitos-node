const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const repository = {id:uuid(), url, title, techs, likes:0};

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
      return response.status(400).json({error:'Repository not found'});
  }

  const repository = repositories[repositoryIndex];
  const newRepository = { url, title, techs };
  const finalRepository = {...repository,...newRepository};

  repositories[repositoryIndex] = finalRepository;

  return response.json(finalRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
      return response.status(400).json({error:'Repository not found'});
  }

  repositories.splice(repositoryIndex,1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error:'Repository not found'});
  }

  let repository = repositories[repositoryIndex];
  repository.likes++;

  return response.json(repository);
});

module.exports = app;

# MyBookList

Rede social para listar, salvar e descobrir livros.

## Rodar a aplicação

Após fazer download do projeto, somente é necessário abrir o arquivo **index.html** no navegador de preferência.

### Rodar pelo Docker

É necessário ter o [Docker](https://docs.docker.com/engine/install/) instalado e em execução.

Abrir o terminal como administrador no diretório que possui o arquivo **Dockerfile** e criar a imagem:

#### `docker build -t mybooklist-front .`

Em seguida, para rodar o projeto, execute o comando:

#### `docker run -p 8080:80 mybooklist-front`

Para abrir a aplicação, basta acessar o link [http://localhost:8080/](http://localhost:8080/) no navegador.

## Fluxograma do projeto

<img width="1760" height="2080" alt="Fluxograma indicando componentes do projeto" src="https://github.com/user-attachments/assets/8d835698-53aa-4254-9e2d-e7bb370e927b" />

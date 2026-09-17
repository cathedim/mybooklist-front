window.onload = listarLivros();
const divLivros = document.getElementById('livros');
const formularioAdicionar = document.getElementById("formularioAdicionar");
const formularioBuscaAvancada = document.getElementById("formularioBuscaAvancada");
const list = document.querySelector("#livros");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const pageNumberValue = document.querySelector("#page-number")

let startIndex = 0;
let endIndex = 10;
let pageNumber = 0;

pageNumberValue.value = pageNumber

function mostraAdicionarLivro() {
  divAdicionar = document.getElementById('div-adicionar');
  
  if (divAdicionar.style.display == "none" || divAdicionar.style.display == "") {
    divAdicionar.style.display = "block";
  }
  else {
    divAdicionar.style.display = "none";
  }
}

function mostraBuscaAvancada() {
  divBuscaAvancada = document.getElementById('div-busca-avancada');
  
  if (divBuscaAvancada.style.display == "none" || divBuscaAvancada.style.display == "") {
    divBuscaAvancada.style.display = "block";
  }
  else {
    divBuscaAvancada.style.display = "none";
  }
}

async function listarLivros() {
  let url = 'http://127.0.0.1:5000/listar_livros';
  const resposta = await fetch(url, {
    method: 'get',
    headers: {
      "Content-Type": "application/json"
    },
    body: null
  })
    .then(async res => {
      if (res.ok) {
        return res.json()
      }
      else {
        const erro = await res.text(); 
        alert(erro);
      }
    })
    .catch((error) => {
      console.error('Erro: ', error);
    });

    listaLivros = resposta.livros;
    tamanho = listaLivros.length;

    if (tamanho === 0) {
      divLivros.innerHTML = '<p>Nenhum livro adicionado!</p>'
    }
    else {
      for (let i = 0; i < tamanho; i++) {
        if (i != 0 && i%10 == 0) {
          divLivros.innerHTML += "<br>"
        }
          
        divLivros.innerHTML += 
            "<li class=\"livro\">"
          + "   <img class=\"capa\" src=\"" + listaLivros[i].capa + "\" alt=\"Capa do livro "+ listaLivros[i].nome +"\">"
          + "   <p class=\"titulo\"" + (listaLivros[i].nome.length > 22 ? "style=\"font-size:11px\"" : "") + ">" + listaLivros[i].nome + "</p>"
          + "   <p class=\"autor\"" + (listaLivros[i].autor.length > 22 ? "style=\"font-size:11px\"" : "") + ">" + listaLivros[i].autor + "</p>"
          + "   <p class=\"ano_publicacao\">" + listaLivros[i].ano_publicacao + "</p>"
          + "   <img class=\"icone\" src=\"img/edit.png\" alt=\"Editar livro\" onClick=\"editarLivro('" + listaLivros[i].nome.replace("'", "\\'") + "')\">"
          + "   <img class=\"icone\" src=\"img/delete.png\" alt=\"Deletar livro\" onClick=\"deletarLivro('" + listaLivros[i].nome.replace("'", "\\'") + "')\">"
          + "</li>"
      }
    }
}

async function buscarLivro() {
  const params = new URLSearchParams({
        nome: document.getElementById("texto-busca").value
    });
    
  let url = `http://127.0.0.1:5000/buscar_livro?${params}`;
  const resposta = await fetch(url, {
    method: 'get',
    body: null
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Erro: ', error);
    });

    divLivros.innerHTML = '<img id="loading" src="img/loading.gif">';

  setTimeout(function() {
    divLivros.innerHTML = '';
    listaLivros = resposta.livros;
    tamanho = listaLivros.length;
    
    if (tamanho === 0) {
      divLivros.innerHTML = '<p>Nenhum livro encontrado!</p>'
    }
    else {
      for (let i = 0; i < tamanho; i++) {
        if (i != 0 && i%10 == 0) {
          divLivros.innerHTML += "<br>"
        }
          
        divLivros.innerHTML += 
            "<li class=\"livro\">"
          + "   <img class=\"capa\" src=\"" + listaLivros[i].capa + "\" alt=\"Capa do livro "+ listaLivros[i].nome +"\">"
          + "   <p class=\"titulo\"" + (listaLivros[i].nome.length > 22 ? "style=\"font-size:11px\"" : "") + ">" + listaLivros[i].nome + "</p>"
          + "   <p class=\"autor\"" + (listaLivros[i].autor.length > 22 ? "style=\"font-size:11px\"" : "") + ">" + listaLivros[i].autor + "</p>"
          + "   <p class=\"ano_publicacao\">" + listaLivros[i].ano_publicacao + "</p>"
          + "   <img class=\"icone\" src=\"img/delete.png\" alt=\"Deletar livro\" onClick=\"deletarLivro('" + listaLivros[i].nome.replace("'", "\\'") + "')\">"
          + "</li>"
      }
    }
  }, 1000);
}

function deletarLivro(nome) {
  if (confirm("Deseja deletar o livro '" + nome + "'?")) {
    const dados = new FormData();
    dados.append('nome', nome);

    let url = 'http://127.0.0.1:5000/deletar_livro';
    fetch(url, {
      method: 'delete',
      body: dados
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Erro: ', error);
      });

    recarregarLivros();
  }
}

function recarregarLivros() {
  divLivros.innerHTML = '<img id="loading" src="img/loading.gif">';

  setTimeout(function() {
    divLivros.innerHTML = '';
    listarLivros();
  }, 1000);
}

formularioAdicionar.addEventListener("submit", function(e) {
  e.preventDefault();

  const dados = new FormData();
  dados.append('nome', document.getElementById("nome").value);
  dados.append('autor', document.getElementById("autor").value);
  dados.append('ano_publicacao', document.getElementById("ano_publicacao").value);
  dados.append('capa', document.getElementById("capa").value);
  
  adicionarLivro(dados);
})

function adicionarLivro(dados) {
  let url = 'http://127.0.0.1:5000/adicionar_livro';
  fetch(url, {
    method: 'post',
    body: dados
  })
    .then(async res => {
      if (res.ok) {
        alert("Livro '"+dados.get("nome")+"' adicionado com sucesso!");
        formularioAdicionar.reset();
      }
      else {
        const erro = await res.text(); 
        if (erro.includes("valid integer")) {
          alert("Erro: ano de publicação precisa ser um número!")
        }
        else {
          alert(erro);
        }
      }
    })
    .catch((error) => {
      console.error('Erro: ', error.message);
    });

    recarregarLivros();
}

formularioBuscaAvancada.addEventListener("submit", async function(e) {
  e.preventDefault();

  const formulario = document.getElementById("formularioBuscaAvancada");
  const formData = new FormData(formulario);
  const tipoSelecionado = formData.get("tipo-busca");

  const params = new URLSearchParams({
      busca: formData.get("busca")
  });

  let url = `http://127.0.0.1:5000/`;

  if (tipoSelecionado == "Nome") url += `buscar_nome?${params}`;
  else if (tipoSelecionado == "Autor") url += `buscar_autor?${params}`;
  else url += `buscar_geral?${params}`;

  divLivros.innerHTML = '<img id="loading" src="img/loading.gif">';

  const resposta = await fetch(url, {
    method: 'get',
    body: null
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Erro: ', error);
    });

    setTimeout(function() {
      tratamentoRespostaAPI(resposta);
    }, 1000);
})

function tratamentoRespostaAPI(resposta) {
  divLivros.innerHTML = '';

  if (resposta['docs'].length == 0) {
    divLivros.innerHTML = '<p>Nenhum livro encontrado!</p>';
  }
  else {
    for (i = 0; i < resposta['docs'].length; i++) {
      if (i != 0 && i%6 == 0) {
          divLivros.innerHTML += "<br>"
        }
          
        divLivros.innerHTML += 
            "<li class=\"livro\" id=\"resposta['docs'][i]['cover_edition_key']\">"
          + "   <img class=\"capa\" src=\"https://covers.openlibrary.org/b/id/" + resposta['docs'][i]['cover_i'] + "-L.jpg\" alt=\"Capa do livro "+ resposta['docs'][i]['title'] +"\">"
          + "   <p class=\"titulo\"" + (resposta['docs'][i]['title'].length > 22 ? "style=\"font-size:11px\"" : "") + ">" + resposta['docs'][i]['title'] + "</p>"
          + "   <p class=\"autor\"" + (resposta['docs'][i]['author_name'].length > 20 ? "style=\"font-size:11px\"" : "") + ">" + resposta['docs'][i]['author_name'] + "</p>"
          + "   <p class=\"ano_publicacao\">" + resposta['docs'][i]['first_publish_year'] + "</p>"
          + "   <img class=\"icone\" src=\"img/add.png\" alt=\"Adicionar\" onClick=\"adicionarAColecao('" + resposta['docs'][i]['title'] + "', '" + resposta['docs'][i]['author_name'] + "', " + resposta['docs'][i]['first_publish_year'] + ", 'https://covers.openlibrary.org/b/id/" + resposta['docs'][i]['cover_i'] + "-L.jpg')\">"
          + "   <img class=\"icone\" src=\"img/info.png\" alt=\"Informações adicionais\" onClick=\"infosLivro('" + resposta['docs'][i]['cover_edition_key'] + "')\">"
          + "</li>"
    }
  }
  //paginar(resposta['docs']);
}

function adicionarAColecao(nome, autor, ano_publicacao, capa) {
  if (confirm("Deseja adicionar o livro '" + nome + "' à coleção?")) {
    const dados = new FormData();
    dados.append('nome', nome);
    dados.append('autor', autor);
    dados.append('ano_publicacao', ano_publicacao);
    dados.append('capa', capa);
    
    adicionarLivro(dados);
  }
}

async function infosLivro(ol_id) {
  const params = new URLSearchParams({
      busca: ol_id
  });
  
  let url = `http://127.0.0.1:5000/buscar_especifica?${params}`;

  const resposta = await fetch(url, {
    method: 'get',
    body: null
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Erro: ', error);
    });

    alert('= Informações adicionais =\n\nPáginas: '+resposta['number_of_pages']+'\nEditora: '+resposta['publishers']);
}

/*
prevButton.addEventListener("click", () => {
  if (endIndex < 20) {
    startIndex = 0;
    endIndex = 10;
  } else {
    startIndex -= 10;
    endIndex -= 10;
    pageNumber -= 1;
  }
  pageNumberValue.value = pageNumber;
  paginar();
});

nextButton.addEventListener("click", () => {
  if (endIndex < respostas.length) {
    startIndex += 10;
    endIndex += 10;
    pageNumber += 1;
  }
  pageNumberValue.value = pageNumber;
  paginar();
});

pageNumberValue.addEventListener("change",(e) => {
  let currentPageNumber = Number.parseInt(e.target.value)
  let maxPageNumber = Math.floor(respostas.length/10)
  if(currentPageNumber > maxPageNumber){
   currentPageNumber = maxPageNumber;
    e.target.value = value
  }
  else if(currentPageNumber < 0){
    currentPageNumber = 0;
    e.target.value = value
  }
   startIndex = currentPageNumber * 10;
   endIndex = startIndex + 10
   pageNumber = currentPageNumber
   paginar();
})

const paginar = (respostas) => {
  console.log("páginar")
  const paginacao = respostas
    .slice(startIndex, endIndex)
    .map((row) => {
      return `<li>${row.name}</li>`;
    })
    .join("");

  list.innerHTML = paginacao;
}
//paginacao();*/
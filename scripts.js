window.onload = listarLivros();
const divLivros = document.getElementById('livros');
formulario = document.getElementById("formulario");

function mostraAdicionarLivro() {
  divEscondida = document.getElementById('div-adicionar');
  
  if (divEscondida.style.display == "none" || divEscondida.style.display == "") {
    divEscondida.style.display = "block";
  }
  else {
    divEscondida.style.display = "none";
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
          + "   <p class=\"titulo\">" + listaLivros[i].nome + "</p>"
          + "   <p class=\"autor\">" + listaLivros[i].autor + "</p>"
          + "   <p class=\"ano_publicacao\">" + listaLivros[i].ano_publicacao + "</p>"
          + "   <img class=\"lixeira\" src=\"img/delete.png\" alt=\"Deletar livro\" onClick=\"deletarLivro('" + listaLivros[i].nome.replace("'", "\\'") + "')\">"
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
          + "   <p class=\"titulo\">" + listaLivros[i].nome + "</p>"
          + "   <p class=\"autor\">" + listaLivros[i].autor + "</p>"
          + "   <p class=\"ano_publicacao\">" + listaLivros[i].ano_publicacao + "</p>"
          + "   <img class=\"lixeira\" src=\"img/delete.png\" alt=\"Deletar livro\" onClick=\"deletarLivro('" + listaLivros[i].nome.replace("'", "\\'") + "')\">"
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

formulario.addEventListener("submit", function(e) {
  e.preventDefault();

  const dados = new FormData();
  dados.append('nome', document.getElementById("nome").value);
  dados.append('autor', document.getElementById("autor").value);
  dados.append('ano_publicacao', document.getElementById("ano_publicacao").value);
  dados.append('capa', document.getElementById("capa").value);
  
  let url = 'http://127.0.0.1:5000/adicionar_livro';
  fetch(url, {
    method: 'post',
    body: dados
  })
    .then(async res => {
      if (res.ok) {
        alert("Livro '"+dados.get("nome")+"' adicionado com sucesso!");
        formulario.reset();
      }
      else {
        const erro = await res.text(); 
        alert(erro);
      }
    })
    .catch((error) => {
      console.error('Erro: ', error.message);
    });

    recarregarLivros();
})
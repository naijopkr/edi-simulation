var express =  require('express');
var app = express();
var ediApi = require('./ediApi/ediApi');

var fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

function imprimeDados(titulo = '', dados = {}) {
  var output = ( 
`#############################################
${titulo.toUpperCase()}

${JSON.stringify(dados)}
#############################################
`);

  console.clear();
  console.log(output);
}

app.get('/comprarProduto/:idProduto', (req, res) => {
  var cliente = {
    idCliente: 9999,
    nome: 'John Smith',
    endereco: 'Rua dos Bobos nº 0'
  };
  var produto = {
    idProduto: req.params.idProduto
  };
  var postData = {
    cliente,
    produto
  };
  imprimeDados('Dados enviados para Centro de Distribuição', postData);
  fs.writeFile('../data/loja_envia_cd.json', JSON.stringify(postData), 'utf8', err => {
    if (err) {
      console.log(err);
    }
  });
  ediApi({ 
    data: postData,
    host: 'localhost',
    path: '/produtos',
    port: 5001,
    method: 'POST'
   });
  res.redirect('/produtos/sucesso');
});

app.get('/produtos', (req, res) => {
  ediApi({
    host: 'localhost',
    path: '/produtos',
    port: 5001,
    method: 'GET'
  }, (chunk) => {
    imprimeDados('Dados recebidos', chunk);
    fs.writeFile('../data/recebido_loja.json', JSON.stringify(chunk), 'utf8', err => {
      if (err) {
        console.log(err);
      }
    });
    res.render('landing', { produtos: chunk });
  });
  
});

app.get('/produtos/sucesso', (req, res) => {
  res.render('success');
})

var port = 5000;
app.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('LOJA VIRTUAL rodando em porta: ' + port);
  }
});
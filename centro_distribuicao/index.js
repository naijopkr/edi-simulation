var express =  require('express');
var bodyParser = require('body-parser');
var { mongoURI } = require('./config/keys');
var mongoose = require('mongoose');
var app = express();
var Produto = require('./models/Produto');
var ediApi = require('./ediApi/ediApi');
var fs = require('fs');

function imprimeDados(titulo = '', dados = {}) {
  var output = ( 
  `#############################################
  ${titulo.toUpperCase()}

  ${JSON.stringify(dados)}
  #############################################
  `);

  console.log(output);
}

mongoose.connect(mongoURI);

app.use(bodyParser.json());

app.get('/produtos', async (req, res) => {
  var produtos = await Produto.find();
  console.clear();
  imprimeDados('Dados enviados para Loja Virtual', produtos);
  fs.writeFile('../data/cd_envia_loja.json', JSON.stringify(produtos), 'utf8', err => {
    if (err) {
      console.log(err);
    }
  });
  res.send(produtos);
});

app.post('/produtos', (req, res) => {
  console.clear();
  imprimeDados('Dados recebidos', req.body);
  fs.writeFile('../data/cd_recebe.json', JSON.stringify(req.body), 'utf8', err => {
    if (err) {
      console.log(err);
    }
  });
  var paraFornecedor = {
    idProduto: req.body.produto.idProduto,
    quantidade: 1
  };

  ediApi({
    data: paraFornecedor,
    host: 'localhost',
    path: '/fornecedor/pedido',
    port: 5002,
    method: 'POST'
  });

  imprimeDados('Dados enviados para Fornecedor', paraFornecedor);
  fs.writeFile('../data/cd_envia_fornecedor.json', JSON.stringify(paraFornecedor), 'utf8', err => {
    if (err) {
      console.log(err);
    }
  });
  var paraTransportadora = {
    destino: {
      nome: req.body.cliente.nome,
      endereco: req.body.cliente.endereco
    },
    notaFiscal: {
      numero: 1254,
      data: Date.now()
    }
  }

  ediApi({
    data: paraTransportadora,
    host: 'localhost',
    path: '/transportadora/pedido',
    port: 5003,
    method: 'POST'
  });

  imprimeDados('Dados enviados para Transportadora', paraTransportadora);
  fs.writeFile('../data/cd_envia_transp.json', JSON.stringify(paraTransportadora), 'utf8', err => {
    if (err) {
      console.log(err);
    }
  });
  res.send({});
});

const PORT = 5001;
app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('CENTRO DE DISTRIBUICAO rodando em porta: ' + PORT);
  }
});
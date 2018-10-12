var express =  require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

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

app.post('/fornecedor/pedido', (req, res) => {
  imprimeDados('Dados recebidos', req.body);
  res.send({});
});

var port = 5002;
app.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`FORNECEDOR rodando em porta: ${port}`);
  }
});
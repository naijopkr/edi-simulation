var mongoose = require('mongoose');
var { Schema } = mongoose;

var produtoSchema = new Schema({
  idProduto: Number,
  descricao: String,
  preco: Number,
  saldo: Number
});

module.exports = mongoose.model('Produto', produtoSchema);
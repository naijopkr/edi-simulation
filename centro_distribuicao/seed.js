const Produto = require('./models/Produto')

const products = [
  {
    idProduto: 1,
    descricao: 'Produto1',
    preco: 99.99,
    saldo: 100
  },
  {
    idProduto: 2,
    descricao: 'Produto2',
    preco: 199.99,
    saldo: 100
  },
  {
    idProduto: 3,
    descricao: 'Produto3',
    preco: 149.99,
    saldo: 100
  },
  {
    idProduto: 4,
    descricao: 'Produto4',
    preco: 59.99,
    saldo: 150
  }
]

const seed = (product) => {
  Produto.create(product, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

for (product of products) {
  seed(product)
}


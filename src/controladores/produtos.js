const knex = require('../conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;
    const { categoria } = req.query;

    try {
        let condicao = `select * from produtos where usuario_id = ${usuario.id}`;

        if (categoria) {
            condicao = `select * from produtos where usuario_id = ${usuario.id} and categoria ilike '%${categoria}%'`;
        }

        const produtos = await knex.raw(condicao).debug();

        return res.status(200).json(produtos.rows);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {

        const consultarProduto = await knex('produtos').where({ id: id, usuario_id: usuario.id }).returning('*').debug();

        if (consultarProduto.length === 0) {
            return res.status(404).json('Produto não encontrado');
        }

        return res.status(200).json(consultarProduto[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório');
    }

    if (!estoque) {
        return res.status(404).json('O campo estoque é obrigatório');
    }

    if (!preco) {
        return res.status(404).json('O campo preco é obrigatório');
    }

    if (!descricao) {
        return res.status(404).json('O campo descricao é obrigatório');
    }

    try {
        const produto = await knex('produtos').insert(
            {
                usuario_id: usuario.id,
                nome,
                estoque,
                preco,
                categoria,
                descricao,
                imagem
            })
            .returning('*')
            .debug();

        if (produto.length === 0) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        return res.status(200).json(produto[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');
    }

    try {
        const consultarProduto = await knex('produtos').where({ id: id, usuario_id: usuario.id }).returning('*').debug();

        if (consultarProduto.length === 0) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoAtualizado = await knex('produtos')
            .update({ nome, estoque, preco, categoria, descricao, imagem })
            .where({ id: id, usuario_id: usuario.id })
            .returning('*')
            .debug();

        if (produtoAtualizado.length === 0) {
            return res.status(400).json("O produto não foi atualizado");
        }

        return res.status(200).json(produtoAtualizado[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const consultarProduto = await knex('produtos').where({ id: id, usuario_id: usuario.id }).returning('*').debug();

        if (consultarProduto.length === 0) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoExcluido = await knex('produtos').delete().where({ id }).returning('*').debug();
        if (produtoExcluido.length === 0) {
            return res.status(400).json("O produto não foi excluido");
        }

        return res.status(200).json(produtoExcluido[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}
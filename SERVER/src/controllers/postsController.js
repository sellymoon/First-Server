import { url } from "inspector";
import { getTodosPosts, criarPost } from "../models/postsModels.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";
export async function listarPosts (req, res) {
    const posts =  await getTodosPosts();
    res.status(200).json(posts);
}

export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro":"falha na requisição"})
    };
}

export async function uploadImagem(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imagemAtualizada)
        res.status(200).json(postCriado);
    } catch(erro){

        console.error(erro.message);
        res.status(500).json({"Erro":"falha na requisição"})
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;
  
    try {
      // Lê o arquivo de imagem
      const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
  
      // Gera a descrição usando a IA
      const descricao = await gerarDescricaoComGemini(imageBuffer);
  
      // Cria o objeto com os dados do post atualizado
      const postAtualizado = {
        imgUrl: urlImagem,
        descricao: descricao,
        alt: req.body.alt, // Adiciona ou atualiza a descrição alternativa
      };
  
      // Chama a função para atualizar o post no banco de dados
      const postAtualizadoNoBanco = await atualizarPost(id, postAtualizado);
  
      // Envia uma resposta com o post atualizado
      res.status(200).json(postAtualizadoNoBanco);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ erro: "Falha ao atualizar o post" });
    }
  }
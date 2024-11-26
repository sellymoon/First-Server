// Importar os módulos necessários: Express para criar o servidor, Multer para lidar com uploads de arquivos e as funções de controle de posts do arquivo postsController.js
import express from "express";
import multer from "multer";
import cors from "cors"
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";

const corsOptions = { 
  origin: "http://localhost:8000", 
  optionSucessStatus: 200
}
// Configurar o armazenamento em disco para os arquivos enviados
const storage = multer.diskStorage({
  // Definir o diretório de destino para os arquivos enviados (./uploads)
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // Definir o nome do arquivo (usar o nome original do arquivo)
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Criar uma instância do Multer com a configuração de armazenamento definida
const upload = multer({ dest: "./uploads", storage });

// Definir as rotas para a aplicação
const routes = (app) => {
  // Usar o middleware Express.json() para analisar requisições JSON
  app.use(express.json());
  app.use(cors(corsOptions))

  // Rota GET para /posts - chama a função listarPosts para listar os posts
  app.get("/posts", listarPosts);

  // Rota POST para /posts - chama a função postarNovoPost para criar um novo post
  app.post("/posts", postarNovoPost);

  // Rota POST para /upload - 
  // - utiliza o middleware upload.single para lidar com um único arquivo enviado com o nome "imagem"
  // - chama a função uploadImagem após o upload bem-sucedido
  app.post("/upload", upload.single("imagem"), uploadImagem);

  app.put("/upload/:id", atualizarNovoPost)
};

// Exportar a função de rotas para ser usada no arquivo principal da aplicação
export default routes;
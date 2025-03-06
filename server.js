const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { pipeline } = require('@xenova/transformers');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Carrega dados uma vez apenas (correto)
const conselhos = JSON.parse(fs.readFileSync('./database/conselhos.json', 'utf8'));
const embeddingsConselhos = JSON.parse(fs.readFileSync('./database/embeddings.json', 'utf8'));

// Função Similaridade Cosseno (embeddings)
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Endpoint inteligente (embedding personalizado)
app.post('/api/advice', async (req, res) => {
  const { texto } = req.body;
  if (!texto) return res.status(400).json({ error: 'Texto não fornecido!' });

  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    revision: 'main',
    auth_token: process.env.HF_TOKEN,
  });

  const resultadoUsuario = await extractor(texto, { pooling: 'mean', normalize: true });
  const embeddingUsuario = Array.from(resultadoUsuario.data);

  let melhorMatch = { conselho: null, similaridade: -Infinity };

  embeddingsConselhos.forEach(item => {
    const similaridade = cosineSimilarity(embeddingUsuario, item.embedding);
    if (similaridade > melhorMatch.similaridade) {
      melhorMatch = { conselho: item, similaridade };
    }
  });

  const conselhoFinal = conselhos.find(c => c.id === melhorMatch.conselho.id);

  res.json({
    metodo: 'embedding',
    conselho: conselhoFinal.conselho,
    versiculo: conselhoFinal.versiculo,
    similaridade: melhorMatch.similaridade.toFixed(4),
  });
});

// Endpoint para consulta direta por tema (retorna todos os versículos do tema)
app.get('/api/tema/:tema', (req, res) => {
  const temaSolicitado = req.params.tema.toLowerCase();
  const resultados = conselhos.filter(item => item.tema.toLowerCase() === temaSolicitado);

  if (resultados.length === 0) {
    return res.status(404).json({ error: 'Tema não encontrado!' });
  }

  res.json(resultados);
});

// Endpoint para listar claramente todos os temas disponíveis
app.get('/api/temas', (req, res) => {
  const temasUnicos = [...new Set(conselhos.map(c => c.tema))];
  res.json(temasUnicos);
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor rodando claramente em http://localhost:3000");
});

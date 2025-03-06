const fs = require('fs');
const { pipeline } = require('@xenova/transformers');
require('dotenv').config();

const conselhos = JSON.parse(fs.readFileSync('./database/conselhos.json', 'utf8'));

async function gerarEmbeddings() {
  console.log("🚀 Carregando o modelo (pode levar alguns minutos)...");

  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    revision: 'main',
    auth_token: process.env.HF_TOKEN,
  });

  const embeddings = [];

  for (const conselho of conselhos) {
    console.log(`🔄 Gerando embedding para o conselho ID ${conselho.id}`);

    const output = await extractor(conselho.conselho, { pooling: 'mean', normalize: true });

    embeddings.push({
      id: conselho.id,
      embedding: Array.from(output.data),
    });

    console.log(`✅ Embedding gerado para ID ${conselho.id}`);
  }

  fs.writeFileSync('./database/embeddings.json', JSON.stringify(embeddings, null, 2));
  console.log('🎉 Todos embeddings foram gerados com sucesso!');
}

gerarEmbeddings();

const fs = require('fs');
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const conselhos = JSON.parse(fs.readFileSync('./database/conselhos.json', 'utf8'));

async function gerarEmbeddings() {
  const embeddings = [];

  for (const conselho of conselhos) {
    const response = await openai.embeddings.create({
      input: conselho.conselho,
      model: 'text-embedding-ada-002',
    });

    embeddings.push({
      id: conselho.id,
      embedding: response.data[0].embedding,
    });

    console.log(`✅ Embedding gerado para o conselho ID ${conselho.id}`);
  }

  fs.writeFileSync('./database/embeddings.json', JSON.stringify(embeddings, null, 2));
  console.log('🎉 Todos embeddings foram gerados com sucesso!');
}

gerarEmbeddings();

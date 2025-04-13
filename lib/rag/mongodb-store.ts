import { Document } from '@langchain/core/documents';
import { MongoClient, ObjectId } from 'mongodb';
import { Embeddings } from '@langchain/core/embeddings';
import { similarity } from 'ml-distance';

if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable');
}

if (!process.env.MONGODB_DB_NAME) {
  throw new Error('Missing MONGODB_DB_NAME environment variable');
}

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = process.env.MONGODB_DB_NAME;
const collectionName = 'embeddings';

export class MongoDBVectorStore {
  private embeddings: Embeddings;
  private collection: any;

  constructor(embeddings: Embeddings) {
    this.embeddings = embeddings;
  }

  async connect() {
    await client.connect();
    const db = client.db(dbName);
    this.collection = db.collection(collectionName);
    
    // Create index for vector search if it doesn't exist
    await this.collection.createIndex({ "metadata": 1 });
  }

  async addDocuments(documents: Document[]) {
    if (!this.collection) {
      await this.connect();
    }

    const embeddings = await this.embeddings.embedDocuments(
      documents.map(doc => doc.pageContent)
    );

    const docs = documents.map((doc, i) => ({
      _id: new ObjectId(),
      pageContent: doc.pageContent,
      metadata: doc.metadata,
      embedding: embeddings[i],
      createdAt: new Date()
    }));

    await this.collection.insertMany(docs);
    return docs;
  }

  async similaritySearch(query: string, k: number = 4) {
    if (!this.collection) {
      await this.connect();
    }

    const queryEmbedding = await this.embeddings.embedQuery(query);
    
    // Get all documents with embeddings
    const allDocs = await this.collection.find({}).toArray();
    
    // Calculate cosine similarity
    const similarities = allDocs.map(doc => ({
      doc,
      similarity: similarity.cosine.cosine(queryEmbedding, doc.embedding)
    }));
    
    // Sort by similarity and get top k
    const topK = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k)
      .map(item => new Document({
        pageContent: item.doc.pageContent,
        metadata: item.doc.metadata
      }));
    
    return topK;
  }

  async asRetriever(k: number = 4) {
    return {
      getRelevantDocuments: async (query: string) => {
        return this.similaritySearch(query, k);
      }
    };
  }
}

// Create a singleton instance
let vectorStore: MongoDBVectorStore | null = null;

export async function getVectorStore(embeddings: Embeddings) {
  if (!vectorStore) {
    vectorStore = new MongoDBVectorStore(embeddings);
    await vectorStore.connect();
  }
  return vectorStore;
}

export async function addDocuments(documents: Document[], embeddings: Embeddings) {
  const store = await getVectorStore(embeddings);
  return store.addDocuments(documents);
}

export async function similaritySearch(query: string, embeddings: Embeddings, k: number = 4) {
  const store = await getVectorStore(embeddings);
  return store.similaritySearch(query, k);
} 
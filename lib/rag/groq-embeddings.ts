import { Embeddings } from '@langchain/core/embeddings';
import { Groq } from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY environment variable');
}

export class GroqEmbeddings extends Embeddings {
  private client: Groq;
  private modelName: string;

  constructor(modelName = 'llama2-70b-4096') {
    super();
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    this.modelName = modelName;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const embeddings = await Promise.all(
      texts.map(text => this.embedQuery(text))
    );
    return embeddings;
  }

  async embedQuery(text: string): Promise<number[]> {
    // For Groq, we'll use their text completion API to generate embeddings
    // We'll use a prompt that encourages the model to generate a representation
    const prompt = `Represent the following text as a vector of numbers between -1 and 1, separated by commas: "${text}"`;
    
    const completion = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: this.modelName,
      temperature: 0,
      max_tokens: 100,
    });
    
    const response = completion.choices[0]?.message?.content || '';
    
    // Parse the response to get the vector
    try {
      // Extract numbers from the response
      const numbers = response.match(/-?\d+(\.\d+)?/g) || [];
      const vector = numbers.map(Number);
      
      // Normalize the vector to ensure it's between -1 and 1
      const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
      const normalizedVector = vector.map(val => val / magnitude);
      
      return normalizedVector;
    } catch (error) {
      console.error('Error parsing Groq embedding response:', error);
      // Return a default vector if parsing fails
      return Array(384).fill(0);
    }
  }
} 
# MyAMU AI

A powerful AI-powered assistant for Aligarh Muslim University (AMU) students and faculty, built with modern web technologies and advanced AI capabilities.

## 🚀 Features

### AI-Powered Assistant
- **Intelligent Chat Interface**: Powered by Google's Gemini 2.0 Flash model
- **Context-Aware Responses**: Maintains conversation history for coherent interactions
- **Multi-Modal Capabilities**: Can process and understand various types of input

### AMU-Specific Features
- **Student Information Lookup**: Quick access to student details using enrollment numbers
- **Exam Schedule & Datesheet**: Retrieve examination schedules and important dates
- **Department Information**: Access details about ZHCET departments
- **Faculty Directory**: Browse and search through faculty members and professors
- **Wikipedia Integration**: Access general knowledge and topic information

### Document Processing
- **PDF Processing**: Upload and analyze PDF documents
- **Vector Search**: Advanced semantic search capabilities using vector embeddings
- **RAG (Retrieval Augmented Generation)**: Enhanced responses using document context

## 🛠️ Tech Stack

### Frontend & Framework
- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type-safe code
- **Astro**: For API routes and server-side functionality

### AI & Machine Learning
- **LangChain**: Framework for developing AI applications
- **Google Gemini AI**: Advanced language model for natural conversations
- **Vector Embeddings**: For semantic search and document processing

### Data Storage & Processing
- **Memory Vector Store**: For efficient document storage and retrieval
- **PDF Processing**: Document parsing and text extraction
- **RESTful APIs**: For data exchange and service integration

## 🔧 Implementation Details

### AI Agent System
- Structured chat agent with multiple specialized tools
- Conversation memory management
- Tool-based approach for specific functionalities

### Document Processing Pipeline
- PDF text extraction and chunking
- Vector embeddings generation
- Semantic search implementation

## 🎯 Project Goals

1. **Student Support**: Provide quick access to academic information and resources
2. **Faculty Assistance**: Streamline administrative tasks and information retrieval
3. **Knowledge Enhancement**: Facilitate learning through AI-powered interactions
4. **Institutional Efficiency**: Improve access to university resources and information

## 🚧 Challenges & Solutions

### Technical Challenges
1. **Type Compatibility**: Resolved type mismatches between LangChain and Google AI implementations
2. **Memory Management**: Implemented efficient conversation history handling
3. **Vector Store Integration**: Optimized document processing and retrieval

### Solutions
- Used TypeScript for better type safety and error prevention
- Implemented ConversationSummaryBufferMemory for efficient memory management
- Leveraged MemoryVectorStore for optimized document retrieval

## 🔍 Notable Features

### AI Capabilities
- Natural language understanding and processing
- Context-aware responses
- Multi-tool integration for specific tasks
- Document analysis and information extraction

### Integration Features
- Student information system integration
- Department and faculty database connectivity
- Wikipedia API integration for general knowledge
- PDF processing and analysis

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - `GEMINI_API_KEY`: Your Google Gemini AI API key
4. Run the development server: `npm run dev`

## 📝 Notes

- Next.js Instrumentation is used for startup functions:
```ts
export function register() {
  startupFunc()
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
// services/streamingApiService.js
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'your-api-gateway-url';

// Enhanced API service with streaming capabilities
export class StreamingApiService {
  static async sendQuestionToAPI(question, userId, isStreaming = false, onStreamChunk = null) {
    const payload = {
      question: question.trim(),
      chat_id: userId.trim(),
      stream: isStreaming
    };

    if (!isStreaming) {
      // Regular non-streaming request
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } else {
      // Streaming request
      return this.handleStreamingRequest(payload, onStreamChunk);
    }
  }

  static async handleStreamingRequest(payload, onStreamChunk) {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullAnswer = '';
    let metadata = {};

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              switch (data.type) {
                case 'start':
                  metadata.sources = data.sources;
                  metadata.question = data.question;
                  if (onStreamChunk) {
                    onStreamChunk({ type: 'start', data });
                  }
                  break;

                case 'content':
                  fullAnswer += data.content;
                  if (onStreamChunk) {
                    onStreamChunk({ 
                      type: 'content', 
                      data: { 
                        content: data.content, 
                        fullContent: fullAnswer 
                      } 
                    });
                  }
                  break;

                case 'complete':
                  metadata.input_tokens = data.input_tokens;
                  metadata.output_tokens = data.output_tokens;
                  if (onStreamChunk) {
                    onStreamChunk({ type: 'complete', data });
                  }
                  break;

                case 'end':
                  if (onStreamChunk) {
                    onStreamChunk({ type: 'end', data });
                  }
                  // Return final result
                  return {
                    question: metadata.question,
                    answer: fullAnswer,
                    sources: metadata.sources || [],
                    input_tokens: metadata.input_tokens || 0,
                    output_tokens: metadata.output_tokens || 0,
                    streamed: true
                  };

                case 'error':
                  throw new Error(data.error);

                default:
                  console.warn('Unknown event type:', data.type);
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Fallback return if stream ends without 'end' event
    return {
      question: metadata.question,
      answer: fullAnswer,
      sources: metadata.sources || [],
      input_tokens: metadata.input_tokens || 0,
      output_tokens: metadata.output_tokens || 0,
      streamed: true
    };
  }
}

// Message creation utilities
export const createBotMessage = (data) => {
  return {
    id: Date.now(),
    type: 'bot',
    content: data.answer,
    sources: data.sources || [],
    cached: data.cache_status === 'hit',
    timestamp: new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    tokens: {
      input: data.input_tokens || 0,
      output: data.output_tokens || 0
    }
  };
};

export const createStreamingBotMessage = (question) => {
  return {
    id: Date.now(),
    type: 'bot',
    content: '',
    sources: [],
    cached: false,
    timestamp: new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    streaming: true,
    tokens: {
      input: 0,
      output: 0
    }
  };
};

export const createUserMessage = (question) => {
  return {
    id: Date.now(),
    type: 'user',
    content: question,
    timestamp: new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  };
};

export const createErrorMessage = (errorMessage) => {
  return {
    id: Date.now(),
    type: 'error',
    content: errorMessage,
    timestamp: new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  };
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  let userErrorMessage = 'Something went wrong. Please try again.';
  let errorMessage = error.message;

  if (error.message.includes('Failed to fetch')) {
    userErrorMessage = 'Unable to connect to the server. Please check your internet connection.';
    errorMessage = 'Network connection error';
  } else if (error.message.includes('HTTP error! status: 429')) {
    userErrorMessage = 'Too many requests. Please wait a moment before trying again.';
    errorMessage = 'Rate limit exceeded';
  } else if (error.message.includes('HTTP error! status: 500')) {
    userErrorMessage = 'Server error. Please try again later.';
    errorMessage = 'Internal server error';
  }

  return { userErrorMessage, errorMessage };
};
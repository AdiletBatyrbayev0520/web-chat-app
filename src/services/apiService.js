import { API_ENDPOINT } from '../constants';

export const sendQuestionToAPI = async (question, userId) => {
  const requestBody = {
    question: question,
    user_id: userId
  };

  console.log('Sending request to:', API_ENDPOINT);
  console.log('Request body:', requestBody);

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(120000), // 2 minute timeout
  });

  console.log('Response received:', {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries())
  });

  const responseText = await response.text();
  console.log('Raw response text:', responseText);

  let data;
  try {
    data = JSON.parse(responseText);
    console.log('Parsed response data:', data);
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    throw new Error(`Invalid JSON response (${response.status}): ${responseText.substring(0, 200)}...`);
  }

  if (!response.ok) {
    console.error('API error:', data);
    throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return data;
};

export const createBotMessage = (data) => ({
  id: Date.now() + 1,
  type: 'bot',
  content: data.answer || 'No answer provided',
  timestamp: new Date().toLocaleTimeString(),
  sources: data.sources || [],
  cacheStatus: data.cache_status,
  cacheType: data.cache_type,
  cached: data.cache_status === 'hit' || data.cache_status === 'partial'
});

export const createUserMessage = (question) => ({
  id: Date.now(),
  type: 'user',
  content: question,
  timestamp: new Date().toLocaleTimeString()
});

export const createErrorMessage = (errorMessage) => ({
  id: Date.now() + 1,
  type: 'error',
  content: errorMessage,
  timestamp: new Date().toLocaleTimeString()
});

export const handleApiError = (error) => {
  console.error('Fetch error details:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause
  });
  
  let userErrorMessage;
  let errorMessage;
  
  if (error.name === 'AbortError' || error.name === 'TimeoutError') {
    userErrorMessage = 'Request timeout - The server is taking too long to respond. Please try again.';
    errorMessage = 'Request Timeout: The server took longer than 2 minutes to respond.';
  } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
    userErrorMessage = 'Network error - Unable to connect to the server. Please check your internet connection and try again.';
    errorMessage = `Network Error: ${error.message}. This could be due to:\n• Internet connectivity issues\n• Server temporarily unavailable\n• CORS configuration problems\n• Firewall or proxy blocking the request`;
  } else if (error.message.includes('CORS')) {
    userErrorMessage = 'CORS error - Cross-origin request blocked. Please contact system administrator.';
    errorMessage = `CORS Error: ${error.message}`;
  } else {
    userErrorMessage = `Connection error: ${error.message}`;
    errorMessage = `Error: ${error.message}`;
  }
  
  return { userErrorMessage, errorMessage };
};
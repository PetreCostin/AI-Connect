const axios = require('axios');

/**
 * IBM watsonx Service
 * Handles communication with IBM watsonx.ai API for AI-powered responses
 */

class WatsonxService {
  constructor() {
    this.apiKey = process.env.WATSONX_API_KEY;
    this.projectId = process.env.WATSONX_PROJECT_ID;
    this.url = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com';
    this.modelId = process.env.WATSONX_MODEL_ID || 'meta-llama/llama-3-70b-instruct';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Get IBM Cloud IAM access token
   * Required for authenticating with watsonx API
   */
  async getAccessToken() {
    // Return cached token if still valid (with 5 min buffer)
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry - 300000) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        'https://iam.cloud.ibm.com/identity/token',
        new URLSearchParams({
          grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
          apikey: this.apiKey
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Token expires in seconds, convert to milliseconds
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Error getting IBM Cloud access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with IBM Cloud');
    }
  }

  /**
   * Send a message to watsonx and get AI response
   * @param {string} message - User's message/question
   * @param {object} options - Additional options for the request
   * @returns {Promise<string>} - AI-generated response
   */
  async sendMessage(message, options = {}) {
    if (!this.apiKey || !this.projectId) {
      throw new Error('watsonx API key and Project ID must be configured in environment variables');
    }

    try {
      // Get valid access token
      const token = await this.getAccessToken();

      // Prepare the request payload for watsonx
      const payload = {
        model_id: this.modelId,
        input: message,
        parameters: {
          max_new_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.7,
          top_p: options.topP || 0.9,
          top_k: options.topK || 50,
          repetition_penalty: 1.1,
          stop_sequences: options.stopSequences || []
        },
        project_id: this.projectId
      };

      // Call watsonx text generation API
      const response = await axios.post(
        `${this.url}/ml/v1/text/generation?version=2023-05-29`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      // Extract and return the generated text
      if (response.data && response.data.results && response.data.results.length > 0) {
        return response.data.results[0].generated_text.trim();
      } else {
        throw new Error('No response generated from watsonx');
      }

    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // API returned an error response
        console.error('watsonx API error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });

        if (error.response.status === 401) {
          throw new Error('Authentication failed. Please check your watsonx API key.');
        } else if (error.response.status === 403) {
          throw new Error('Access forbidden. Please check your watsonx project permissions.');
        } else if (error.response.status === 404) {
          throw new Error('watsonx API endpoint not found. Please check your configuration.');
        } else if (error.response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`watsonx API error: ${error.response.data.message || error.response.statusText}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response from watsonx:', error.message);
        throw new Error('Unable to connect to watsonx. Please check your network connection.');
      } else {
        // Other errors
        console.error('Error setting up watsonx request:', error.message);
        throw error;
      }
    }
  }

  /**
   * Validate service configuration
   * @returns {boolean} - True if configured correctly
   */
  isConfigured() {
    return !!(this.apiKey && this.projectId);
  }
}

// Export singleton instance
module.exports = new WatsonxService();

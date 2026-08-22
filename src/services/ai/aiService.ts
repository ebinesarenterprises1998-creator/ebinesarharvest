/**
 * AI Service Client Abstraction
 * 
 * IMPORTANT SECURITY NOTE:
 * All AI generation calls must be proxied via secure server endpoints.
 * Never expose private Gemini or AI API keys in client-side code.
 */

export interface GeneratedContentResult {
  success: boolean;
  content?: string;
  error?: string;
  isConfigured: boolean;
}

export const aiService = {
  /**
   * Generates an evocative, faith-inspired, SEO-rich product description
   */
  async generateProductDescription(params: {
    productName: string;
    category: string;
    keyIngredientsOrFeatures: string[];
    tone?: 'pastoral' | 'luxury' | 'wholesome';
  }): Promise<GeneratedContentResult> {
    try {
      const response = await fetch('/api/ai/generate-product-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (response.status === 501 || response.status === 404) {
        return {
          success: false,
          isConfigured: false,
          error: 'AI Generation Service is not yet configured. Please add GEMINI_API_KEY to your server secrets.',
        };
      }

      const data = await response.json();
      return {
        success: Boolean(data.content),
        content: data.content,
        error: data.error,
        isConfigured: true,
      };
    } catch (err: any) {
      return {
        success: false,
        isConfigured: false,
        error: 'AI service endpoint unreachable or server not configured.',
      };
    }
  },

  /**
   * Generates promotional campaign & social media marketing copy
   */
  async generateMarketingContent(params: {
    campaignName: string;
    theme: string;
    targetAudience: string;
    platform: 'instagram' | 'newsletter' | 'banner' | 'sms';
  }): Promise<GeneratedContentResult> {
    try {
      const response = await fetch('/api/ai/generate-marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (response.status === 501 || response.status === 404) {
        return {
          success: false,
          isConfigured: false,
          error: 'AI Marketing Assistant is pending server configuration. Configure GEMINI_API_KEY to activate.',
        };
      }

      const data = await response.json();
      return {
        success: Boolean(data.content),
        content: data.content,
        error: data.error,
        isConfigured: true,
      };
    } catch (err: any) {
      return {
        success: false,
        isConfigured: false,
        error: 'AI Marketing endpoint unreachable.',
      };
    }
  },

  /**
   * Generates SEO meta title and descriptions for products or harvest categories
   */
  async generateSEODescription(params: {
    title: string;
    keywords: string[];
  }): Promise<GeneratedContentResult> {
    try {
      const response = await fetch('/api/ai/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (response.status === 501 || response.status === 404) {
        return {
          success: false,
          isConfigured: false,
          error: 'SEO AI generator requires GEMINI_API_KEY environment variable.',
        };
      }

      const data = await response.json();
      return {
        success: Boolean(data.content),
        content: data.content,
        error: data.error,
        isConfigured: true,
      };
    } catch (err: any) {
      return {
        success: false,
        isConfigured: false,
        error: 'SEO AI generator unreachable.',
      };
    }
  },
};

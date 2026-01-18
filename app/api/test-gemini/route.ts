import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    const results: any = {
      apiKeyConfigured: true,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      availableModels: []
    };

    // List available models
    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const listResponse = await fetch(listUrl);
      
      if (listResponse.ok) {
        const data = await listResponse.json();
        results.availableModels = data.models?.map((m: any) => ({
          name: m.name,
          displayName: m.displayName,
          supportedMethods: m.supportedGenerationMethods
        })) || [];
      } else {
        const errorText = await listResponse.text();
        results.listModelsError = {
          status: listResponse.status,
          error: errorText
        };
      }
    } catch (error: any) {
      results.listModelsError = error.message;
    }

    // If listing didn't work, the API key is completely invalid
    if (!results.availableModels || results.availableModels.length === 0) {
      results.diagnosis = '❌ YOUR API KEY IS INVALID OR EXPIRED';
      results.solution = [
        '1. Go to: https://aistudio.google.com/app/apikey',
        '2. DELETE your old API key if it exists',
        '3. Click "Create API Key" button',
        '4. Select "Create API key in new project" or choose existing project',
        '5. Copy the NEW key',
        '6. Update .env file with the new key',
        '7. Restart the server (Ctrl+C and run npm run dev)'
      ];
    }

    return new Response(
      JSON.stringify(results, null, 2),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ 
        error: 'Test failed',
        message: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

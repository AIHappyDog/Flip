export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Handle root path
    if (path === '/') {
      path = '/index.html';
    }

    // Remove leading slash for asset lookup
    const assetPath = path.startsWith('/') ? path.slice(1) : path;
    
    // Log the requested path for debugging
    console.log('Requested path:', assetPath);
    
    try {
      // Try to fetch the asset directly without modifying the URL
      const asset = await env.ASSETS.fetch(request);
      return asset;
    } catch (e) {
      console.error('Error fetching asset:', e);
      
      // If the asset is not found, try index.html
      if (path !== '/index.html') {
        try {
          // Create a new request for index.html
          const indexRequest = new Request(url.origin + '/index.html');
          const indexAsset = await env.ASSETS.fetch(indexRequest);
          return indexAsset;
        } catch (indexError) {
          console.error('Error fetching index.html:', indexError);
          return new Response('Not Found', { status: 404 });
        }
      }
      return new Response('Not Found', { status: 404 });
    }
  },
}; 
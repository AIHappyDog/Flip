export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Handle root path
    if (path === '/') {
      path = '/index.html';
    }

    try {
      // Remove leading slash for asset lookup
      const assetPath = path.startsWith('/') ? path.slice(1) : path;
      
      // Log the requested path for debugging
      console.log('Requested path:', assetPath);
      
      // Try to fetch the asset
      const asset = await env.ASSETS.fetch(new Request(url.origin + '/' + assetPath));
      
      // Clone the response to modify headers
      const response = new Response(asset.body, asset);
      
      // Set appropriate content type based on file extension
      if (assetPath.endsWith('.html')) {
        response.headers.set('Content-Type', 'text/html');
      } else if (assetPath.endsWith('.css')) {
        response.headers.set('Content-Type', 'text/css');
      } else if (assetPath.endsWith('.js')) {
        response.headers.set('Content-Type', 'application/javascript');
      } else if (assetPath.endsWith('.png')) {
        response.headers.set('Content-Type', 'image/png');
      }
      
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', '*');
      
      return response;
    } catch (e) {
      console.error('Error fetching asset:', e);
      console.error('Failed path:', path);
      
      // Try to fetch index.html as fallback
      try {
        const indexAsset = await env.ASSETS.fetch(new Request(url.origin + '/index.html'));
        return new Response(indexAsset.body, {
          headers: { 'Content-Type': 'text/html' }
        });
      } catch (indexError) {
        return new Response('Not Found: ' + path, { 
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    }
  },
}; 
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let path = url.pathname;
    if (path === '/') {
      path = '/index.html';
    }

    // Remove leading slash for asset lookup
    const assetPath = path.startsWith('/') ? path.slice(1) : path;

    try {
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
      
      return response;
    } catch (e) {
      console.error('Error fetching asset:', e);
      return new Response('Not Found: ' + assetPath, { status: 404 });
    }
  },
}; 
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let path = url.pathname;
    if (path === '/') {
      path = '/index.html';
    }

    try {
      const asset = await env.ASSETS.fetch(new Request(url.origin + path));
      return asset;
    } catch (e) {
      return new Response('Not Found', { status: 404 });
    }
  },
}; 
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let response;
    try {
      if (url.pathname.startsWith('/api/'))
        response = await handleApi(request, env);
      else if (url.pathname.startsWith('/media/'))
        response = await handleMedia(request, env);
      else if (!['GET', 'HEAD'].includes(request.method))
        response = new Response('Method not allowed', { status: 405 });
      else {
        const asset =
          ASSETS[url.pathname === '/' ? '/index.html' : url.pathname] ||
          (!url.pathname.split('/').at(-1).includes('.')
            ? ASSETS['/index.html']
            : null);
        response = asset
          ? new Response(
              request.method === 'HEAD'
                ? null
                : Uint8Array.from(atob(asset.body), (c) => c.charCodeAt(0)),
              {
                headers: {
                  'Content-Type': asset.type,
                  'Cache-Control': asset.type.startsWith('text/html')
                    ? 'no-store'
                    : 'public, max-age=3600',
                },
              },
            )
          : new Response('Not found', { status: 404 });
      }
    } catch {
      response = new Response('Temporarily unavailable', { status: 503 });
    }
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()',
    );
    headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://chatgpt.com https://*.chatgpt.com",
    );
    if (
      url.pathname.startsWith('/admin-room') ||
      url.pathname.startsWith('/api/')
    )
      headers.set('X-Robots-Tag', 'noindex, nofollow');
    return new Response(response.body, { status: response.status, headers });
  },
};

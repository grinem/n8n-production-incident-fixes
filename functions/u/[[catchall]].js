async function proxyToApi(context, stripPrefix = "") {
  const url = new URL(context.request.url);
  let targetPath = url.pathname;
  if (stripPrefix && targetPath.startsWith(stripPrefix)) {
    targetPath = targetPath.slice(stripPrefix.length) || "/";
  }
  const targetUrl = "https://api.hooktriage.com" + targetPath + url.search;

  const headers = new Headers(context.request.headers);
  headers.set("Host", "api.hooktriage.com");
  headers.set("X-Forwarded-Host", url.host);
  headers.set("X-Forwarded-Proto", "https");
  headers.delete("cf-connecting-ip");

  const init = {
    method: context.request.method,
    headers,
    redirect: "manual",
  };
  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    init.body = context.request.body;
  }

  const upstream = await fetch(targetUrl, init);
  const respHeaders = new Headers(upstream.headers);
  return { upstream, respHeaders };
}

export async function onRequest(context) {
  const { upstream, respHeaders } = await proxyToApi(context);
  respHeaders.set("X-Robots-Tag", "noindex, nofollow");
  respHeaders.set("Cache-Control", "no-store, max-age=0");
  return new Response(upstream.body, { status: upstream.status, headers: respHeaders });
}

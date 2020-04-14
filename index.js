addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

var variantIndex; // global scope

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const resp = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
  const respJson = await resp.json();
  const variantsArray = respJson.variants; // Contains two URLs

  // Extra credit 2: Persisting variants
  varientIndexString = getIndexStringFromCookieString(request.headers.get('cookie'));
  // Use cookie index if it exists, or randomly assign 0 or 1
  variantIndex = varientIndexString ? parseInt(varientIndexString) : Math.floor(Math.random() * 2);
  let response = await fetch(variantsArray[variantIndex]); // response.body is ReadableStream

  // Extra credit 1: Changing copy/URLs
  newResponse = replaceHTML(response);

  // Return the ReadableStream
  return new Response(
    newResponse.body,
    {headers: { 'Set-Cookie': `variantCookie=${variantIndex}` },}
  );
}


function getIndexStringFromCookieString(cookieString) {
  if (!cookieString)
    return null

  const regex = new RegExp('variantCookie=([01])');
  let match = cookieString.match(regex);
  return match ? match[1] : null // return 1st capturing group if cookie present
}


function replaceHTML(response) {
  return new HTMLRewriter()
    .on('*', new ElementHandler())
    .transform(response);
}

class ElementHandler {
  element(element) {
    switch(element.tagName) {
      case "title":
        element.setInnerContent("Tommy's CloudFlare Application");
        break;
      
      case "h1":
        element.setInnerContent(`My Custom Variant ${variantIndex+1}`);
        break;
      
      case "p":
        element.setInnerContent("Check out my amazing personal website :)");
        break;

      case "a":
        element.setAttribute("href", "https://tommyli3318.github.io/");
        element.setInnerContent("https://tommyli3318.github.io/");
        break;
    }
  }
}
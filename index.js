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

  variantIndex = Math.floor(Math.random() * 2); // Choose 0 or 1
  let response = await fetch(variantsArray[variantIndex]); // response.body is ReadableStream

  newResponse = replaceHTML(response);
  return new Response(newResponse.body); // Return the ReadableStream
}

function replaceHTML(response) {
  // Extra credit: Changing copy/URLs
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
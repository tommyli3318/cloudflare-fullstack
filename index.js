addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const resp = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
  const respJson = await resp.json();
  const variantsArray = respJson.variants; // Contains two URLs

  var randomIndex = Math.floor(Math.random() * 2); // Choose 0 or 1
  const response = await fetch(variantsArray[randomIndex]); // response.body is ReadableStream
  return new Response(response.body); // Return the ReadableStream
}

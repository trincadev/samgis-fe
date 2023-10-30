// Respond to OPTIONS method
export const onRequest: PagesFunction = async (context) => {
  console.log("context:", context, "#")
  return new Response("still alive");
};

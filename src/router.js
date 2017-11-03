async function resolve(routes, context) {
  const uri = context.error ? "/error" : context.pathname;
  const route = routes.find(r => r.test(uri));

  if (!route) {
    const error = new Error("not found");
    error.status = 404;
    throw error;
  }

  const params = route.params(uri);
  return await route.action(...context, params);
}

export default { resolve };


async function resolve(routes, context) {
  const uri = context.error ? '/error' : context.pathname;
  const route = routes.find(r => r.path === uri);

  if (!route) {
    const error = new Error('not found');
    error.status = 404;
    throw error;
  }

  return await route.action(...context);

}

export default { resolve };

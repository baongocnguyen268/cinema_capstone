export function paginate(items, page, perPage) {
  if (!Array.isArray(items)) return [];
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

const BASE_URL = 'https://thenationbrief.com/wp-json/wp/v2'

export async function fetchPosts(params = {}) {
  const query = new URLSearchParams({ _embed: 1, per_page: 12, ...params }).toString()
  const res = await fetch(`${BASE_URL}/posts?${query}`)
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export async function fetchPostBySlug(slug) {
  const res = await fetch(`${BASE_URL}/posts?slug=${slug}&_embed`)
  if (!res.ok) throw new Error('Failed to fetch post')
  const data = await res.json()
  return data[0] || null
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories?per_page=20`)
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}
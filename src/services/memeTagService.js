import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/api/meme-tags', data)
  },
  batchCreate(data) {
    return apiService.httpAuth.post('/api/meme-tags/batch', data)
  },
  batchCreateId(id, data) {
    return apiService.httpAuth.post(`/api/meme-tags/${id}/batch`, data)
  },
  getAll() {
    return apiService.http.get('/api/meme-tags')
  },
  get(id) {
    return apiService.http.get(`/api/meme-tags/${id}`)
  },
  getTagsByMemeId(memeId) {
    return apiService.http.get(`/api/meme-tags/meme/${memeId}/tags`)
  },
  getMemesByTagId(tagId) {
    return apiService.http.get(`/api/meme-tags/tag/${tagId}/memes`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/api/meme-tags/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/api/meme-tags/${id}`)
  },
  removeAllTagsByMeme(memeId) {
    return apiService.httpAuth.delete(`/api/meme-tags/meme/${memeId}/tags`)
  },
}

import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/meme-tags', data)
  },
  batchCreate(data) {
    return apiService.httpAuth.post('/meme-tags/batch', data)
  },
  getAll() {
    return apiService.http.get('/meme-tags')
  },
  get(id) {
    return apiService.http.get(`/meme-tags/${id}`)
  },
  getTagsByMemeId(memeId) {
    return apiService.http.get(`/meme-tags/meme/${memeId}/tags`)
  },
  getMemesByTagId(tagId) {
    return apiService.http.get(`/meme-tags/tag/${tagId}/memes`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/meme-tags/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/meme-tags/${id}`)
  },
  removeAllTagsByMeme(memeId) {
    return apiService.httpAuth.delete(`/meme-tags/meme/${memeId}/tags`)
  },
}

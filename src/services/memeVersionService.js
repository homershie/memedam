import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/meme-versions', data)
  },
  getAll() {
    return apiService.httpAuth.get('/meme-versions')
  },
  get(id) {
    return apiService.httpAuth.get(`/meme-versions/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/meme-versions/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/meme-versions/${id}`)
  },
}

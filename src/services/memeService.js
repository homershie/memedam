import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/memes', data)
  },
  getAll() {
    return apiService.http.get('/memes')
  },
  get(id) {
    return apiService.http.get(`/memes/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/memes/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/memes/${id}`)
  },
  addEditor(id, data) {
    return apiService.httpAuth.post(`/memes/${id}/editors`, data)
  },
  removeEditor(id) {
    return apiService.httpAuth.delete(`/memes/${id}/editors`)
  },
  proposeEdit(id, data) {
    return apiService.httpAuth.post(`/memes/${id}/proposals`, data)
  },
  listProposals(id) {
    return apiService.httpAuth.get(`/memes/${id}/proposals`)
  },
  approveProposal(id, proposalId) {
    return apiService.httpAuth.post(
      `/memes/${id}/proposals/${proposalId}/approve`,
    )
  },
  rejectProposal(id, proposalId) {
    return apiService.httpAuth.post(
      `/memes/${id}/proposals/${proposalId}/reject`,
    )
  },
}

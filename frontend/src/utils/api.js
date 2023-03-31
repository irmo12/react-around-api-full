class Api {
  constructor({ baseURL, headers }) {
    this._baseURL = baseURL
    this._headers = headers
  }

  _processResponse = (res) => {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.statusText}`)
  }

   getInitialCards(token) {
    return fetch(`${this._baseURL}/cards`, {
      headers: { ...this._headers, Authorization: `Bearer ${token}` },
    }).then((res) => this._processResponse(res))
  }

  patchUserInfo(data, token) {
    return fetch(`${this._baseURL}/users/me`, {
      headers: { ...this._headers, Authorization: `Bearer ${token}` },
      method: 'PATCH',
      body: JSON.stringify(data),
    }).then((res) => this._processResponse(res))
  }

  postNewCard(data, token) {
    return fetch(`${this._baseURL}/cards`, {
      headers: { ...this._headers, Authorization: `Bearer ${token}` },
      method: 'POST',
      body: JSON.stringify(data),
    }).then((res) => this._processResponse(res))
  }

  deleteCard(id, token) {
    return fetch(`${this._baseURL}/cards/${id}`, {
      headers: {...this._headers, Authorization: `Bearer ${token}` },
      method: 'DELETE',
    }).then((res) => this._processResponse(res))
  }

  changeLikeCardStatus(id, isLiked, token) {
    return fetch(`${this._baseURL}/cards/likes/${id}`, {
      headers: { ...this._headers, Authorization: `Bearer ${token}` },
      method: isLiked ? 'DELETE' : 'PUT',
    }).then((res) => this._processResponse(res))
  }

  changeAvatar(avatar, token) {
    return fetch(`${this._baseURL}/users/me/avatar`, {
      headers: { ...this._headers, Authorization: `Bearer ${token}` },
      method: 'PATCH',
      body: JSON.stringify( avatar ),
    }).then((res) => this._processResponse(res))
  }

  registerParams(data) {
    return fetch(`${this._baseURL}/signup`, {
      headers: this._headers,
      method: 'POST',
      body: JSON.stringify(data),
    }).then((res) => this._processResponse(res))
  }

  authorizationParams(data) {
    return fetch(`${this._baseURL}/signin`, {
      headers: this._headers,
      method: 'POST',
      body: JSON.stringify(data),
    }).then((res) => this._processResponse(res))
  }

  getUserAuth(token) {
    return fetch(`${this._baseURL}/users/me`, {
      headers: { ...this._headers, Authorization: `Bearer ${token}` },
      method: 'GET',
    }).then((res) => this._processResponse(res))
  }
}

const api = new Api({
  baseURL: 'api.',
  headers: {
    'Content-Type': 'application/json',
  },
})

export { api }

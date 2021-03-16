import axios from 'axios';

//https://api.hgbrasil.com/weather?key=a6a7e6ea&lat=-23.682&lon=-46.875

export const key = 'a6a7e6ea';

const api = axios.create({
  baseURL: `https://api.hgbrasil.com`
})

export default api;
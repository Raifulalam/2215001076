// services/api.js
import axios from 'axios';

// const BASE_URL = 'http://20.244.56.144/evaluation-service';
const BASE_URL = 'http://locahost:3000';

export const getUsers = async () => {
    const res = await axios.get(`${BASE_URL}/users`);
    return res.data;
};

export const getPosts = async () => {
    const res = await axios.get(`${BASE_URL}/posts`);
    return res.data;
};

export const getComments = async () => {
    const res = await axios.get(`${BASE_URL}/comments`);
    return res.data;
};
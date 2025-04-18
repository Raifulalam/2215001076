const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;

const BASE_URL = "http://20.244.56.144/evaluation-service";
let token = "";

// Fetch auth token by giving the data provided by the company on registration
async function fetchAuthToken() {
    try {
        const response = await axios.post(`${BASE_URL}/auth`, {
            email: "mohammed.alam_cs22@gla.ac.in",
            name: "mohammed raiful alam",
            rollNo: "2215001076",
            accessCode: "CNneGT",
            clientID: "af275320-b0fc-4650-bada-46cc43cb350c",
            clientSecret: "UTjJcPYdTBvRvpem"

        });
        token = response.data.access_token;
        console.log("Token accessed:", token);
    } catch (err) {
        console.error("Error while fetching token:", err.response?.data || err.message);
    }
}
fetchAuthToken()

//making auth available for all the routes 
async function getWithAuth(url) {
    console.log(`[Fetching]: ${url}`);
    const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`[Fetched]: Data from ${url}`);
    return response.data;
}

// get top 5 users most comments on post 
app.get("/users", async (req, res) => {
    try {
        await fetchAuthToken();
        const usersData = await getWithAuth(`${BASE_URL}/users`);
        const users = usersData.users;
        let userCommentCounts = [];

        for (let userId in users) {
            console.log(`Fetching posts for user: ${users[userId]} (${userId})`);
            const postsData = await getWithAuth(`${BASE_URL}/users/${userId}/posts`);
            let commentCount = 0;

            for (let post of postsData.posts) {
                console.log(`Fetching comments for post: ${post.id}`);
                const comments = await getWithAuth(`${BASE_URL}/posts/${post.id}/comments`);
                commentCount += comments.comments.length;
            }

            console.log(`Total comments for user ${users[userId]}: ${commentCount}`);

            userCommentCounts.push({
                id: userId,
                name: users[userId],
                comments: commentCount
            });
        }

        userCommentCounts.sort((a, b) => b.comments - a.comments);
        console.log("[Top 5 Users]:", userCommentCounts.slice(0, 5));
        res.json(userCommentCounts.slice(0, 5));
    } catch (err) {
        console.error("Error in /users:", err.response?.data || err.message);
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

//get lates and popular post 
app.get("/posts", async (req, res) => {
    const type = req.query.type;
    if (!type || !["latest", "popular"].includes(type)) {
        return res.status(400).json({ error: "Query param 'type' required (latest|popular)" });
    }

    try {
        await fetchAuthToken();
        const usersData = await getWithAuth(`${BASE_URL}/users`);
        const users = usersData.users;

        let allPosts = [];

        for (let userId in users) {
            console.log(`Fetching posts for user: ${users[userId]} (${userId})`);
            const postsData = await getWithAuth(`${BASE_URL}/users/${userId}/posts`);

            for (let post of postsData.posts) {
                console.log(`Fetching comments for post: ${post.id}`);
                const comments = await getWithAuth(`${BASE_URL}/posts/${post.id}/comments`);
                allPosts.push({ ...post, commentCount: comments.comments.length });
            }
        }

        if (type === "latest") {
            const latest = allPosts.sort((a, b) => b.id - a.id).slice(0, 5);
            console.log("[Latest Posts]:", latest);
            return res.json(latest);
        }

        if (type === "popular") {
            const maxCount = Math.max(...allPosts.map(p => p.commentCount));
            const popular = allPosts.filter(p => p.commentCount === maxCount);
            console.log("[Most Popular Posts]:", popular);
            return res.json(popular);
        }
    } catch (err) {
        console.error("Error in /posts:", err.response?.data || err.message);
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Sucessfully accessed')
})

app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});

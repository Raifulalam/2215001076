
import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/api';

export default function Feed() {
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        const fetchFeed = async () => {
            const posts = await getPosts();
            setFeed(posts.sort((a, b) => b.id - a.id));
        };

        fetchFeed();
        const interval = setInterval(fetchFeed, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-3">Live Feed</h2>
            {feed.map(post => (
                <div key={post.id} className="border-b py-2">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p>{post.body}</p>
                </div>
            ))}
        </div>
    );
}
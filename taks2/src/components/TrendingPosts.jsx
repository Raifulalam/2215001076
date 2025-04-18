
import React, { useEffect, useState } from 'react';
import { getPosts, getComments } from '../services/api';

export default function TrendingPosts() {
    const [trendingPosts, setTrendingPosts] = useState([]);

    useEffect(() => {
        const fetchTrendingPosts = async () => {
            const posts = await getPosts();
            const comments = await getComments();

            const commentCounts = posts.map(post => ({
                ...post,
                commentCount: comments.filter(c => c.postId === post.id).length
            }));

            const maxCount = Math.max(...commentCounts.map(p => p.commentCount));
            const trending = commentCounts.filter(p => p.commentCount === maxCount);
            setTrendingPosts(trending);
        };

        fetchTrendingPosts();
    }, []);

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-3">Trending Posts</h2>
            {trendingPosts.map(post => (
                <div key={post.id} className="mb-4">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p>{post.body}</p>
                    <p className="text-sm text-gray-500">Comments: {post.commentCount}</p>
                </div>
            ))}
        </div>
    );
}
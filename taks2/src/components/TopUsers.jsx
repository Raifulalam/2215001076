
import React, { useEffect, useState } from 'react';
import { getUsers, getPosts } from '../services/api';

export default function TopUsers() {
    const [topUsers, setTopUsers] = useState([]);

    useEffect(() => {
        const fetchTopUsers = async () => {
            const users = await getUsers();
            const posts = await getPosts();

            const userPostCounts = users.map(user => ({
                ...user,
                postCount: posts.filter(post => post.userId === user.id).length
            }));

            const sorted = userPostCounts.sort((a, b) => b.postCount - a.postCount).slice(0, 5);
            setTopUsers(sorted);
        };

        fetchTopUsers();
    }, []);

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-3">Top Users</h2>
            <ul>
                {topUsers.map(user => (
                    <li key={user.id} className="mb-2">
                        <div className="flex items-center space-x-3">
                            <img src={`https://picsum.photos/seed/user${user.id}/50`} alt="user" className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">Posts: {user.postCount}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
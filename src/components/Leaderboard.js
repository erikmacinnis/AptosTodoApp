import React, {useState} from 'react';

const Leaderboard = ({users}) => {

    const leaderboardRow = ({ users }) => {
        return (
            <tbody>
                {users.map((user, index) => (
                    <tr key={index}>
                        <td data-label="Address">{user.address}</td>
                        <td data-label="Value">{user.value}</td>
                    </tr>
                ))}
            </tbody>
        );
    };

    return (
        <>
            <div style={{ margin: '100px' }}>
                <table className="ui celled table">
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th>CompletedTodos</th>
                        </tr>
                    </thead>
                    {/* {leaderboardRow(users)} */}
                </table>
            </div>
        </>
    )
}

export default Leaderboard;
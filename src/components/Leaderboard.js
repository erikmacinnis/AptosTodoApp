import React from 'react';

const Leaderboard = ({leaderboard}) => {

    const leaderboardRow = () => {
        return (
            <tbody>
                {leaderboard.map((user, index) => {
                return (
                    <tr key={index}>
                        <td data-label="Address">{user.address}</td>
                        <td data-label="Value">{user.numCompleteTodos}</td>
                    </tr>
                )  
                } )}
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
                    {leaderboard.length > 0 && leaderboardRow()}
                </table>
            </div>
        </>
    )
}

export default Leaderboard;
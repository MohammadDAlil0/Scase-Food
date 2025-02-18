const NotificationsDropdown = ({ notifications, currentPage, lastPage, onNextPage, onPreviousPage }) => {
    return (
        <div className="notifications-dropdown">
            <h3>Notifications</h3>
            <ul>
                {notifications.map((notification) => (
                    <li key={notification.id}>
                        <strong>{notification.title}</strong>
                        <p>{notification.description}</p>
                        <small>{new Date(notification.createdAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
            <div className="pagination">
                <button onClick={onPreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button onClick={onNextPage} disabled={currentPage === lastPage}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default NotificationsDropdown;
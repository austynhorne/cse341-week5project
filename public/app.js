document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const registerBtn = document.getElementById('register-btn');
    const manualLoginBtn = document.getElementById('manual-login-btn');
    const viewUsersBtn = document.getElementById('view-users-btn');
    const userInfo = document.getElementById('user-info');
    const usernameSpan = document.getElementById('username');
    const userRoleSpan = document.getElementById('user-role');
    const profilePic = document.getElementById('profile-pic');
    const usersSection = document.getElementById('users-section');
    const usersList = document.getElementById('users-list');
    const fishSection = document.getElementById('fish-section');
    const fishList = document.getElementById('fish-list');

    // Check if user is logged in
    checkAuthStatus();

    loginBtn.addEventListener('click', function() {
        window.location.href = '/auth/google';
    });

    logoutBtn.addEventListener('click', function() {
        fetch('/logout', { method: 'GET' })
            .then(() => {
                checkAuthStatus();
            })
            .catch(err => console.error('Logout error:', err));
    });

    // Manual registration
    registerBtn.addEventListener('click', async () => {
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const favoriteSpecies = document.getElementById('reg-species').value;

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, favoriteSpecies })
            });
            if (response.ok) {
                alert('Registration successful! Please login.');
            } else {
                const error = await response.json();
                alert('Registration failed: ' + error.error);
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    });

    // Manual login
    manualLoginBtn.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                checkAuthStatus();
            } else {
                const error = await response.json();
                alert('Login failed: ' + error.error);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    });

    // View all users (admin)
    viewUsersBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/users/admin/all');
            if (response.ok) {
                const users = await response.json();
                displayUsers(users);
                usersSection.style.display = 'block';
            } else {
                alert('Access denied');
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    });

    function checkAuthStatus() {
        fetch('/api/current-user')
            .then(response => response.json())
            .then(data => {
                if (data.username) {
                    // User is logged in
                    loginBtn.style.display = 'none';
                    logoutBtn.style.display = 'inline-block';
                    userInfo.style.display = 'block';
                    fishSection.style.display = 'block';
                    usernameSpan.textContent = data.username;
                    userRoleSpan.textContent = data.role || 'user';
                    if (data.role === 'admin') {
                        viewUsersBtn.style.display = 'inline-block';
                    }
                    if (data.profilePic) {
                        profilePic.src = data.profilePic;
                        profilePic.style.display = 'inline-block';
                    }
                    loadFishData();
                } else {
                    // User is not logged in
                    loginBtn.style.display = 'inline-block';
                    logoutBtn.style.display = 'none';
                    userInfo.style.display = 'none';
                    usersSection.style.display = 'none';
                    fishSection.style.display = 'none';
                }
            })
            .catch(err => {
                console.error('Auth check error:', err);
                loginBtn.style.display = 'inline-block';
                logoutBtn.style.display = 'none';
                userInfo.style.display = 'none';
                usersSection.style.display = 'none';
                fishSection.style.display = 'none';
            });
    }

    function loadFishData() {
        fetch('/api/fish')
            .then(response => response.json())
            .then(fish => {
                fishList.innerHTML = '';
                if (fish.length === 0) {
                    fishList.innerHTML = '<p>No fish catches yet.</p>';
                } else {
                    fish.forEach(f => {
                        const fishItem = document.createElement('div');
                        fishItem.className = 'fish-item';
                        fishItem.innerHTML = `
                            <h3>${f.species}</h3>
                            <p><strong>River:</strong> ${f.river}</p>
                            <p><strong>Weight:</strong> ${f.weightOz} oz</p>
                            <p><strong>Length:</strong> ${f.lengthIn} in</p>
                            <p><strong>Lure:</strong> ${f.lureUsed}</p>
                            ${f.notes ? `<p><strong>Notes:</strong> ${f.notes}</p>` : ''}
                        `;
                        fishList.appendChild(fishItem);
                    });
                }
            })
            .catch(err => {
                console.error('Error loading fish data:', err);
                fishList.innerHTML = '<p>Error loading fish data.</p>';
            });
    }

    function displayUsers(users) {
        usersList.innerHTML = '';
        users.forEach(u => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <h3>${u.username}</h3>
                <p><strong>Email:</strong> ${u.email}</p>
                <p><strong>Role:</strong> ${u.role || 'user'}</p>
                <p><strong>Joined:</strong> ${new Date(u.joinDate).toLocaleDateString()}</p>
                ${u.favoriteSpecies ? `<p><strong>Favorite Species:</strong> ${u.favoriteSpecies}</p>` : ''}
            `;
            usersList.appendChild(userItem);
        });
    }
});

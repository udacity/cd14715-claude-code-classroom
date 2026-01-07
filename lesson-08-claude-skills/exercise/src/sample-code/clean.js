/**
 * User service with proper patterns
 */

const API_BASE = '/api/v1';

const fetchUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
};

const formatUserName = (user) => {
  if (!user?.name) {
    return 'Unknown User';
  }
  return user.name.trim();
};

export { fetchUser, formatUserName };

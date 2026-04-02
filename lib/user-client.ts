import { UserProfile } from '@/app/api/user/route';

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const response = await fetch(`/api/user?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const createUserProfile = async (userId: string, email: string): Promise<void> => {
  try {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, email }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user profile');
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserStreak = async (userId: string, completedAll: boolean): Promise<void> => {
  try {
    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, completedAll }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user streak');
    }
  } catch (error) {
    console.error('Error updating user streak:', error);
    throw error;
  }
};

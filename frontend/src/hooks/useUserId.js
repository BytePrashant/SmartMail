import { useEffect, useState } from 'react';

// Hook to get or generate a persistent user id stored in sessionStorage
export default function useUserId(storageKey = 'smartmail_user_id') {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    let existing = sessionStorage.getItem(storageKey);
    if (!existing) {
      existing = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem(storageKey, existing);
    }
    setUserId(existing);
  }, [storageKey]);

  return userId;
}

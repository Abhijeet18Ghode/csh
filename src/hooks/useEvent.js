import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function useEvent(eventId) {
  const { data: session } = useSession();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const registerForEvent = async (userId) => {
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register for event');
      }

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return {
    event,
    loading,
    error,
    registerForEvent,
  };
} 
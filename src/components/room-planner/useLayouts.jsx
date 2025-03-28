import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useLayouts() {
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/layouts', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      setLayouts(response.data.layouts);
      setLoading(false);
    })
    .catch(error => {
      console.error("Error loading layouts:", error);
      setLoading(false);
    });
  }, []);

  return { layouts, loading };
}

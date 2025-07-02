import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await axios.get('/api/announcements/latest', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAnnouncement(res.data);
      } catch {
        setAnnouncement(null);
      }
    };
    fetchAnnouncement();
  }, []);

  if (!announcement || !visible) return null;

  return (
    <div className="bg-yellow-200 border-l-4 border-yellow-500 text-yellow-900 p-4 mb-4 flex items-center justify-between">
      <div>
        <span className="font-bold mr-2">Announcement:</span>
        {announcement.message}
        {announcement.expiry && (
          <span className="ml-4 text-xs text-gray-700">(Expires: {new Date(announcement.expiry).toLocaleString()})</span>
        )}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 text-yellow-900 hover:text-yellow-700 font-bold"
        title="Close"
      >
        ×
      </button>
    </div>
  );
};

export default AnnouncementBanner; 
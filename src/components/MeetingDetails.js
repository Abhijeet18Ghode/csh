import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaVideo, FaLock, FaCopy, FaEdit } from 'react-icons/fa';

export default function MeetingDetails({ event, isCreator }) {
  const { data: session } = useSession();
  const [meetingDetails, setMeetingDetails] = useState(event.meetingDetails || {});
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/events/${event._id}/meeting`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to update meeting details');
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating meeting details:', error);
    }
  };

  if (!meetingDetails.type || meetingDetails.type === 'in-person') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center">
          <FaVideo className="mr-2" />
          Meeting Details
        </h3>
        {isCreator && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit />
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Platform</label>
            <select
              value={meetingDetails.platform || ''}
              onChange={(e) => setMeetingDetails({ ...meetingDetails, platform: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Platform</option>
              <option value="zoom">Zoom</option>
              <option value="google-meet">Google Meet</option>
              <option value="microsoft-teams">Microsoft Teams</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Meeting Link</label>
            <input
              type="text"
              value={meetingDetails.meetingLink || ''}
              onChange={(e) => setMeetingDetails({ ...meetingDetails, meetingLink: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Meeting ID</label>
            <input
              type="text"
              value={meetingDetails.meetingId || ''}
              onChange={(e) => setMeetingDetails({ ...meetingDetails, meetingId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="text"
              value={meetingDetails.meetingPassword || ''}
              onChange={(e) => setMeetingDetails({ ...meetingDetails, meetingPassword: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Instructions</label>
            <textarea
              value={meetingDetails.meetingInstructions || ''}
              onChange={(e) => setMeetingDetails({ ...meetingDetails, meetingInstructions: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-medium">Platform:</span>
            <span className="ml-2 capitalize">{meetingDetails.platform}</span>
          </div>

          {meetingDetails.meetingLink && (
            <div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Meeting Link:</span>
                <button
                  onClick={() => handleCopy(meetingDetails.meetingLink)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaCopy />
                </button>
              </div>
              <a
                href={meetingDetails.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {meetingDetails.meetingLink}
              </a>
            </div>
          )}

          {meetingDetails.meetingId && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Meeting ID:</span>
              <div className="flex items-center">
                <span className="mr-2">{meetingDetails.meetingId}</span>
                <button
                  onClick={() => handleCopy(meetingDetails.meetingId)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          )}

          {meetingDetails.meetingPassword && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Password:</span>
              <div className="flex items-center">
                <span className="mr-2">{meetingDetails.meetingPassword}</span>
                <button
                  onClick={() => handleCopy(meetingDetails.meetingPassword)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          )}

          {meetingDetails.meetingInstructions && (
            <div>
              <span className="font-medium">Instructions:</span>
              <p className="mt-1 text-gray-600 whitespace-pre-line">
                {meetingDetails.meetingInstructions}
              </p>
            </div>
          )}
        </div>
      )}

      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
} 
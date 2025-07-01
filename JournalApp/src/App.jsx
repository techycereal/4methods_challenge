import React, { useState, useEffect } from 'react';

const JOURNAL_API = 'YOUR_API_URL';

export default function JournalApp() {
  const [entries, setEntries] = useState([]);
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('Happy');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ entry: '', mood: '', date: '' });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const res = await fetch(JOURNAL_API);
    const data = await res.json();
    setEntries(data);
  };

  const addEntry = async () => {
    if (!entry.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    const res = await fetch(JOURNAL_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry, mood, date: today })
    });
    const newEntry = await res.json();
    setEntries([...entries, newEntry]);
    setEntry('');
    setMood('Happy');
  };

  const startEditing = (entry) => {
    setEditingId(entry.id);
    setEditData({ entry: entry.entry, mood: entry.mood, date: entry.date });
  };

  const updateEntry = async (id) => {
    const res = await fetch(`${JOURNAL_API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData)
    });
    const updated = await res.json();
    setEntries(entries.map(e => e.id === id ? updated : e));
    setEditingId(null);
    setEditData({ entry: '', mood: '', date: '' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ entry: '', mood: '', date: '' });
  };

  const deleteEntry = async (id) => {
    await fetch(`${JOURNAL_API}/${id}`, { method: 'DELETE' });
    setEntries(entries.filter(e => e.id !== id));
  };

  const getMoodColor = (mood) => {
    const map = {
      Happy: 'text-yellow-600',
      Sad: 'text-blue-600',
      Anxious: 'text-red-500',
      Excited: 'text-green-600',
      Calm: 'text-purple-600'
    };
    return map[mood] || 'text-gray-700';
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 shadow-xl rounded-xl mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">📔 Journal</h2>

      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        rows="4"
        placeholder="Today I felt..."
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option>Happy</option>
          <option>Sad</option>
          <option>Anxious</option>
          <option>Excited</option>
          <option>Calm</option>
        </select>
        <button
          onClick={addEntry}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          Add Entry
        </button>
      </div>

      <ul className="space-y-4">
        {entries.map(e => (
          <li key={e.id} className="bg-white p-4 rounded-lg shadow flex flex-col">
            {editingId === e.id ? (
              <div className="space-y-2">
                <textarea
                  value={editData.entry}
                  onChange={(e) => setEditData({ ...editData, entry: e.target.value })}
                  className="w-full border p-2 rounded"
                  rows="3"
                />
                <input
                  type="date"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  className="border p-2 rounded w-full sm:w-auto"
                />
                <select
                  value={editData.mood}
                  onChange={(e) => setEditData({ ...editData, mood: e.target.value })}
                  className="border p-2 rounded w-full sm:w-auto"
                >
                  <option>Happy</option>
                  <option>Sad</option>
                  <option>Anxious</option>
                  <option>Excited</option>
                  <option>Calm</option>
                </select>
                <div className="space-x-2">
                  <button
                    onClick={() => updateEntry(e.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500">{e.date}</span>
                  <span className={`text-sm font-semibold ${getMoodColor(e.mood)}`}>
                    {e.mood}
                  </span>
                </div>
                <p className="text-gray-800 mb-2">{e.entry}</p>
                <div className="space-x-4">
                  <button
                    onClick={() => startEditing(e)}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEntry(e.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

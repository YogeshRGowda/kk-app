import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', designation: '' });
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/profile`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setForm({
          username: data.username,
          email: data.email,
          designation: data.designation || ''
        });
        setPreview(data.photo_url ? `${API_URL}${data.photo_url}` : null);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    await fetch(`${API_URL}/api/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (photo) {
      const formData = new FormData();
      formData.append('file', photo);
      await fetch(`${API_URL}/api/profile/photo`, {
        method: 'POST',
        body: formData
      });
    }
    window.location.reload();
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="flex items-center gap-4 mb-4">
        <img
          src={preview || '/default-avatar.png'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        {edit && (
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        )}
      </div>
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium">Name</label>
          {edit ? (
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          ) : (
            <div>{profile.username}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Designation</label>
          {edit ? (
            <input
              name="designation"
              value={form.designation}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          ) : (
            <div>{profile.designation}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          {edit ? (
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          ) : (
            <div>{profile.email}</div>
          )}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {edit ? (
          <>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
              Save
            </button>
            <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEdit(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setEdit(true)}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
} 
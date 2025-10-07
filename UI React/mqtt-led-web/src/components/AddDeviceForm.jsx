import React, { useState } from 'react';

function AddDeviceForm({ onDeviceAdded }) {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !topic.trim()) {
      alert('Vui lòng nhập đầy đủ tên và topic.');
      return;
    }
    try {
      await onDeviceAdded({ name, topic });
      setName('');
      setTopic('');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Đăng ký thiết bị mới</h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên thiết bị (ví dụ: Đèn phòng khách)"
          className="flex-grow p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
        />
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="MQTT Topic (ví dụ: iot/phongkhach/den)"
          className="flex-grow p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
        />
        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          Thêm
        </button>
      </form>
    </div>
  );
}

export default AddDeviceForm;

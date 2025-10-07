import React from 'react';

// Icon bóng đèn
const LedIcon = ({ isOn }) => (
  <svg className={`w-8 h-8 mr-4 transition-colors duration-300 ${isOn ? 'text-yellow-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a1 1 0 011 1v1h-2V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-3.536a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 16a1 1 0 011 1v1h-2v-1a1 1 0 011-1zM4.95 14.536L4.243 15.243a1 1 0 101.414 1.414l.707-.707a1 1 0 00-1.414-1.414zM2.879 11.121a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414z" />
  </svg>
);

function DeviceCard({ device, onControl }) {
  const isDeviceOn = device.status === 'ON';

  return (
    <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-between shadow-md transition-all hover:shadow-cyan-500/20 hover:scale-[1.02]">
      <div className="flex items-center">
        <LedIcon isOn={isDeviceOn} />
        <div>
          <p className="font-semibold text-lg text-white">{device.name}</p>
          <p className="text-xs text-gray-400">Topic: {device.topic}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onControl(device.id, 'ON')}
          disabled={isDeviceOn}
          className="px-5 py-2 rounded-full font-semibold transition text-sm text-white bg-green-600 hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          BẬT
        </button>
        <button
          onClick={() => onControl(device.id, 'OFF')}
          disabled={!isDeviceOn}
          className="px-5 py-2 rounded-full font-semibold transition text-sm text-white bg-red-600 hover:bg-red-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          TẮT
        </button>
      </div>
    </div>
  );
}

export default DeviceCard;

import React, { useState, useEffect, useCallback } from 'react';
import * as api from './services/api';
import AddDeviceForm from './components/AddDeviceForm';
import DeviceCard from './components/DeviceCard';
import TelemetryLog from './components/TelemetryLog';

function App() {
  const [devices, setDevices] = useState([]);
  const [telemetryMessages, setTelemetryMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm để tải lại danh sách thiết bị
  const fetchDevices = useCallback(async () => {
    try {
      const data = await api.getDevices();
      setDevices(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect để tải danh sách thiết bị khi component mount lần đầu
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Effect để kết nối tới Server-Sent Events (SSE)
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8080/telemetry/stream');

    // Lắng nghe tin nhắn từ server
    eventSource.onmessage = (event) => {
      // Khi có tin nhắn mới (ví dụ: trạng thái thiết bị thay đổi)
      // 1. Thêm tin nhắn vào log để hiển thị
      setTelemetryMessages(prevMessages => [...prevMessages, { data: event.data, timestamp: Date.now() }]);
      
      // 2. Tải lại danh sách thiết bị để cập nhật UI
      fetchDevices(); 
    };

    // Xử lý lỗi kết nối
    eventSource.onerror = () => {
      console.error('Lỗi kết nối Server-Sent Events.');
      setTelemetryMessages(prev => [...prev, { data: 'Mất kết nối tới server stream...', timestamp: Date.now() }]);
      eventSource.close();
    };

    // Cleanup: Đóng kết nối khi component unmount
    return () => {
      eventSource.close();
    };
  }, [fetchDevices]); // fetchDevices được đưa vào dependency array để đảm bảo luôn dùng phiên bản mới nhất

  // Hàm xử lý khi thêm thiết bị mới
  const handleAddDevice = async (deviceData) => {
    await api.addDevice(deviceData);
    fetchDevices(); // Tải lại danh sách sau khi thêm
  };

  // Hàm xử lý khi điều khiển thiết bị
  const handleControlDevice = async (deviceId, command) => {
    try {
      await api.controlDevice(deviceId, command);
      // Không cần gọi fetchDevices() ở đây nữa vì SSE sẽ tự động cập nhật!
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-400">Bảng Điều Khiển Thiết Bị IoT</h1>
          <p className="text-gray-400 mt-2">Quản lý và điều khiển các thiết bị ESP32 qua MQTT</p>
        </header>
        
        <main>
          <AddDeviceForm onDeviceAdded={handleAddDevice} />
          
          <h2 className="text-2xl font-bold text-white mb-4 mt-8 border-l-4 border-cyan-500 pl-3">Danh sách thiết bị</h2>
          
          {isLoading && <p className="text-center">Đang tải...</p>}
          {error && <p className="text-center text-red-500 bg-red-900/50 p-3 rounded-lg">{error}</p>}
          
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {devices.length > 0 ? (
                devices.map((device) => (
                  <DeviceCard key={device.id} device={device} onControl={handleControlDevice} />
                ))
              ) : (
                <p className="text-gray-500 md:col-span-2 text-center">Chưa có thiết bị nào được đăng ký.</p>
              )}
            </div>
          )}

          <TelemetryLog messages={telemetryMessages} />
        </main>
      </div>
    </div>
  );
}

export default App;

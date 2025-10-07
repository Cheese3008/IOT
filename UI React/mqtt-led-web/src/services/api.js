// Dựa trên application.properties, server chạy ở port 8080.
const API_BASE_URL = 'http://localhost:8080';

/**
 * Lấy danh sách tất cả các thiết bị từ server.
 * @returns {Promise<Array>} Mảng các đối tượng thiết bị.
 */
export const getDevices = async () => {
    const response = await fetch(`${API_BASE_URL}/devices`);
    if (!response.ok) {
        throw new Error('Không thể tải danh sách thiết bị.');
    }
    return response.json();
};

/**
 * Thêm một thiết bị mới.
 * Dữ liệu gửi đi phải khớp với model `Device` trong Spring Boot.
 * @param {object} deviceData - Dữ liệu thiết bị mới, ví dụ: { name: 'Đèn phòng ngủ', topic: 'iot/phongngu/den' }
 * @returns {Promise<object>} Đối tượng thiết bị vừa được tạo.
 */
export const addDevice = async (deviceData) => {
    const response = await fetch(`${API_BASE_URL}/devices`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceData),
    });
    if (!response.ok) {
        throw new Error('Thêm thiết bị thất bại.');
    }
    return response.json();
};

/**
 * Gửi lệnh điều khiển (ON/OFF) đến một thiết bị.
 * Dữ liệu gửi đi phải khớp với class `CommandRequest` trong Controller.
 * @param {number} deviceId - ID của thiết bị.
 * @param {string} command - Lệnh điều khiển, "ON" hoặc "OFF".
 * @returns {Promise<string>} Tin nhắn phản hồi từ server.
 */
export const controlDevice = async (deviceId, command) => {
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/control`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }), // Body phải là {"command": "ON/OFF"}
    });
    if (!response.ok) {
        throw new Error('Gửi lệnh điều khiển thất bại.');
    }
    return response.text(); // Endpoint này trả về text, không phải JSON.
};

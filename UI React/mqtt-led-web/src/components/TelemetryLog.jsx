import React, { useEffect, useRef } from 'react';

function TelemetryLog({ messages }) {
    const logContainerRef = useRef(null);

    // Tự động cuộn xuống dưới khi có tin nhắn mới
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [messages]);


    return (
        <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg mt-8">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Nhật ký sự kiện (Real-time)</h3>
            <div ref={logContainerRef} className="h-40 overflow-y-auto bg-black rounded p-2 font-mono text-sm text-green-400">
                {messages.length === 0 && <p className="text-gray-500">Đang chờ sự kiện từ server...</p>}
                {messages.map((msg, index) => (
                    <p key={index} className="whitespace-pre-wrap animate-fadeIn">
                        <span className="text-gray-500 mr-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        {msg.data}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default TelemetryLog;

'use client';

import { useState } from 'react';

export default function HomePage() {
  const [message, setMessage] = useState('Chưa kiểm tra');
  const [loading, setLoading] = useState(false);

  async function checkConnection() {
    setLoading(true);
    setMessage('Đang kết nối...');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error('Thiếu NEXT_PUBLIC_API_URL');
      }

      const response = await fetch(`${apiUrl}/health`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`API trả lỗi HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'ok') {
        throw new Error('API trả kết quả không như mong đợi');
      }

      setMessage('Đã kết nối thành công với NestJS');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Không thể kết nối backend',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 32 }}>
      <h1>Inventory Alert</h1>

      <button onClick={checkConnection} disabled={loading}>
        {loading ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
      </button>

      <p role="status">{message}</p>
    </main>
  );
}
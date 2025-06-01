"use client";

import { useEffect, useState } from 'react';

export default function TestBlogPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Blog posts fetched successfully:', result);
        setData(result);
        setStatus('success');
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err instanceof Error ? err.message : String(err));
        setStatus('error');
      }
    };

    testApi();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Test Blog API</h1>

      {status === 'loading' && (
        <div className="p-4 bg-blue-100 text-blue-700 rounded">
          Loading...
        </div>
      )}

      {status === 'success' && (
        <div className="p-4 bg-green-100 text-green-700 rounded">
          <p className="font-bold">Success!</p>
          <p>The blog API is working correctly.</p>
          <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <p className="font-bold">Error!</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

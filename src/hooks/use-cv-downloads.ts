import { useState, useEffect } from 'react';

interface CVDownloadHook {
  downloadCount: number;
  isLoading: boolean;
  incrementDownload: () => Promise<void>;
  refreshCount: () => Promise<void>;
}

export function useCVDownloads(): CVDownloadHook {
  const [downloadCount, setDownloadCount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch current download count
  const refreshCount = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cv-downloads');
      const data = await response.json();
      
      if (data.success) {
        setDownloadCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching download count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Increment download count
  const incrementDownload = async () => {
    try {
      const response = await fetch('/api/cv-downloads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'increment' }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDownloadCount(data.count);
      }
    } catch (error) {
      console.error('Error incrementing download count:', error);
    }
  };

  // Load initial count on mount
  useEffect(() => {
    refreshCount();
  }, []);

  return {
    downloadCount,
    isLoading,
    incrementDownload,
    refreshCount,
  };
}

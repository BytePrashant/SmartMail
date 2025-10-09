import { useEffect, useRef, useState } from 'react';
import apiFetch from '../api';

// Encapsulates sending emails + client-side simulated progress + cleanup
export default function useSendProgress() {
  const intervalRef = useRef(null);
  const abortRef = useRef(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progressCurrent, setProgressCurrent] = useState(0);
  const [progressDone, setProgressDone] = useState(false);
  const [progressTotal, setProgressTotal] = useState(0);
  const [progressEstimated, setProgressEstimated] = useState(0);

  useEffect(() => {
    return () => {
      // Cleanup interval and abort any ongoing request
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const startSend = async ({ subject, body, data, pdfFile, userId, onError } = {}) => {
    if (!userId) {
      onError && onError(new Error('Missing userId'));
      return;
    }

    setShowProgress(true);
    setProgressCurrent(0);
    setProgressDone(false);
    setProgressTotal(data.length || 0);

    const DELAY_PER_EMAIL = 10; // seconds
    setProgressEstimated(Math.round((data.length || 0) * DELAY_PER_EMAIL));

    // Start simulated progress
    let sent = 0;
    intervalRef.current = setInterval(() => {
      sent++;
      setProgressCurrent(c => Math.min(c + 1, data.length || 0));
      setProgressEstimated(e => Math.max(e - DELAY_PER_EMAIL, 0));
      if (sent >= (data.length || 0)) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, DELAY_PER_EMAIL * 1000);

    // Real request
    abortRef.current = new AbortController();
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('body', body);
      formData.append('data', JSON.stringify(data));
      if (pdfFile) formData.append('attachment', pdfFile);

      const res = await apiFetch('/api/v1/send-emails', {
        method: 'POST',
        body: formData,
        userId,
        signal: abortRef.current.signal,
      });

      setProgressCurrent(data.length || 0);
      setProgressEstimated(0);
      setProgressDone(true);
      return res;
    } catch (err) {
      setProgressDone(true);
      onError && onError(err);
      return Promise.reject(err);
    }
  };

  const reset = () => {
    setShowProgress(false);
    setProgressCurrent(0);
    setProgressDone(false);
    setProgressTotal(0);
    setProgressEstimated(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  };

  return {
    showProgress,
    progressCurrent,
    progressDone,
    progressTotal,
    progressEstimated,
    startSend,
    reset,
  };
}

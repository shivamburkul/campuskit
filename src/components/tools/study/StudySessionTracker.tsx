'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

interface Session {
  id: number;
  subject: string;
  startTime: Date;
  endTime: Date | null;
  duration: number;
}

export function StudySessionTracker() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSubject, setCurrentSubject] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const startSession = () => {
    if (!currentSubject.trim()) return;
    setIsTracking(true);
    setStartTime(new Date());
    setElapsed(0);
  };

  const stopSession = () => {
    if (!isTracking || !startTime) return;
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    setSessions([
      ...sessions,
      {
        id: nextId,
        subject: currentSubject,
        startTime,
        endTime,
        duration,
      },
    ]);
    setNextId(nextId + 1);
    setIsTracking(false);
    setStartTime(null);
    setElapsed(0);
    setCurrentSubject('');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const subjectStats = sessions.reduce((acc, s) => {
    acc[s.subject] = (acc[s.subject] || 0) + s.duration;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={currentSubject}
          onChange={(e) => setCurrentSubject(e.target.value)}
          placeholder="Subject name"
          disabled={isTracking}
          className="flex-1 rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
        />
        <Button type="button" onClick={isTracking ? stopSession : startSession} disabled={!currentSubject.trim() && !isTracking}>
          {isTracking ? 'Stop' : 'Start'}
        </Button>
      </div>

      {isTracking && (
        <div className="mt-4 text-center">
          <p className="font-display text-4xl font-semibold text-primary-600 dark:text-primary-400">{formatTime(elapsed)}</p>
          <p className="text-sm text-ink-500">Studying: {currentSubject}</p>
        </div>
      )}

      {sessions.length > 0 && (
        <div className="mt-6">
          <ResultPanel>
            <ResultStat label="Total study time" value={formatTime(totalTime)} emphasis />
            <div className="mt-3 border-t border-ink-200/60 pt-3">
              <p className="text-sm font-medium text-ink-700 mb-2">Subject breakdown</p>
              {Object.entries(subjectStats).map(([subject, time]) => (
                <div key={subject} className="flex justify-between text-sm text-ink-600 dark:text-ink-400">
                  <span>{subject}</span>
                  <span>{formatTime(time)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-ink-200/60 pt-3">
              <p className="text-sm text-ink-500">{sessions.length} sessions completed</p>
            </div>
          </ResultPanel>
        </div>
      )}
    </div>
  );
}

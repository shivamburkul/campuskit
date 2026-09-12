'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/Field';
import { InlineNote } from '@/components/ui/Result';

export function TextToSpeech() {
  const [text, setText] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [voice, setVoice] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Load available voices
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  function handleSpeak() {
    if (!text.trim() || typeof window === 'undefined') return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find((v) => v.name === voice);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  function handleStop() {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }

  if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
    return (
      <InlineNote tone="warning">
        Your browser doesn&apos;t support speech synthesis. Please use a modern browser like Chrome, Firefox, or Edge.
      </InlineNote>
    );
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Type or paste text you want to hear..."
        className="w-full resize-y rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
      />

      {voices.length > 0 && (
        <SelectField
          label="Voice"
          value={voice}
          onChange={setVoice}
          options={voices.map((v) => ({ value: v.name, label: v.name }))}
        />
      )}

      <div className="flex gap-2">
        <Button type="button" onClick={handleSpeak} disabled={!text.trim()}>
          {speaking ? 'Stop' : 'Read Aloud'}
        </Button>
        {speaking && (
          <Button variant="secondary" type="button" onClick={handleStop}>
            Cancel
          </Button>
        )}
      </div>

      <InlineNote>
        Text-to-speech runs entirely in your browser using the Web Speech API. Your text is never sent to a server.
      </InlineNote>
    </div>
  );
}

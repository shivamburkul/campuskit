'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { ResultPanel } from '@/components/ui/Result';

interface Card {
  id: number;
  front: string;
  back: string;
}

export function FlashcardMaker() {
  const [cards, setCards] = useState<Card[]>([
    { id: 1, front: 'What is photosynthesis?', back: 'Process by which plants convert sunlight into food.' },
    { id: 2, front: 'What is Newton\'s 2nd Law?', back: 'F = ma — Force equals mass times acceleration.' },
  ]);
  const [nextId, setNextId] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [shuffledOrder, setShuffledOrder] = useState<number[]>(cards.map((_, i) => i));

  function shuffle() {
    const order = cards.map((_, i) => i);
    // Fisher-Yates shuffle
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j]!, order[i]!];
    }
    setShuffledOrder(order);
    setCurrentIndex(0);
    setShowBack(false);
  }

  const currentCard = cards[shuffledOrder[currentIndex] ?? 0];

  function nextCard() {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowBack(false);
    }
  }

  function prevCard() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowBack(false);
    }
  }

  function addCard() {
    setCards([...cards, { id: nextId, front: 'New question', back: 'New answer' }]);
    setNextId(nextId + 1);
    setShuffledOrder([...shuffledOrder, cards.length]);
  }

  function removeCard(id: number) {
    const newCards = cards.filter((c) => c.id !== id);
    setCards(newCards);
    setShuffledOrder(newCards.map((_, i) => i));
    setCurrentIndex(Math.min(currentIndex, Math.max(0, newCards.length - 1)));
  }

  function updateCard(id: number, patch: Partial<Card>) {
    setCards(cards.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  return (
    <div className="space-y-8">
      {/* Flashcard view */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-ink-500">
            Card {currentIndex + 1} of {cards.length}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" type="button" onClick={shuffle}>Shuffle</Button>
          </div>
        </div>

        <button
          onClick={() => setShowBack(!showBack)}
          className="w-full min-h-[300px] rounded-xl border border-ink-200 bg-surface p-8 flex items-center justify-center text-center transition-all hover:shadow-lg"
        >
          <div>
            <p className="text-xs uppercase text-ink-500 mb-2">
              {showBack ? 'Answer' : 'Question'} (click to flip)
            </p>
            <p className="text-xl font-medium text-ink-900 dark:text-ink-50">
              {showBack ? currentCard?.back : currentCard?.front}
            </p>
          </div>
        </button>

        <div className="flex justify-center gap-3 mt-4">
          <Button variant="secondary" type="button" onClick={prevCard} disabled={currentIndex === 0}>
            ← Previous
          </Button>
          <Button variant="secondary" type="button" onClick={nextCard} disabled={currentIndex >= cards.length - 1}>
            Next →
          </Button>
        </div>
      </div>

      {/* Card management */}
      <div className="border-t border-ink-100 pt-6">
        <h3 className="font-medium text-ink-900 dark:text-ink-50 mb-4">Manage Flashcards</h3>
        <div className="space-y-3">
          {cards.map((card) => (
            <div key={card.id} className="grid grid-cols-1 gap-2 sm:grid-cols-[2fr_2fr_auto]">
              <TextField
                value={card.front}
                onChange={(e) => updateCard(card.id, { front: e.target.value })}
                placeholder="Front (question)"
              />
              <TextField
                value={card.back}
                onChange={(e) => updateCard(card.id, { back: e.target.value })}
                placeholder="Back (answer)"
              />
              <Button variant="ghost" type="button" onClick={() => removeCard(card.id)}>Remove</Button>
            </div>
          ))}
        </div>
        <Button variant="secondary" type="button" className="mt-4" onClick={addCard}>
          + Add Card
        </Button>
      </div>
    </div>
  );
}

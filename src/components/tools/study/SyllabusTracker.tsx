'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

interface Topic {
  id: number;
  name: string;
  completed: boolean;
}

interface Subject {
  id: number;
  name: string;
  topics: Topic[];
}

export function SyllabusTracker() {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: 1,
      name: 'Mathematics',
      topics: [
        { id: 1, name: 'Algebra', completed: true },
        { id: 2, name: 'Calculus', completed: false },
        { id: 3, name: 'Geometry', completed: false },
      ],
    },
    {
      id: 2,
      name: 'Physics',
      topics: [
        { id: 4, name: 'Mechanics', completed: true },
        { id: 5, name: 'Thermodynamics', completed: false },
      ],
    },
  ]);
  const [nextSubjectId, setNextSubjectId] = useState(3);
  const [nextTopicId, setNextTopicId] = useState(6);

  function toggleTopic(subjectId: number, topicId: number) {
    setSubjects(subjects.map((s) =>
      s.id === subjectId
        ? { ...s, topics: s.topics.map((t) => t.id === topicId ? { ...t, completed: !t.completed } : t) }
        : s
    ));
  }

  function addSubject() {
    setSubjects([...subjects, { id: nextSubjectId, name: `Subject ${nextSubjectId}`, topics: [] }]);
    setNextSubjectId(nextSubjectId + 1);
  }

  function addTopic(subjectId: number) {
    setSubjects(subjects.map((s) =>
      s.id === subjectId
        ? { ...s, topics: [...s.topics, { id: nextTopicId, name: `Topic ${s.topics.length + 1}`, completed: false }] }
        : s
    ));
    setNextTopicId(nextTopicId + 1);
  }

  function removeSubject(subjectId: number) {
    setSubjects(subjects.filter((s) => s.id !== subjectId));
  }

  const allTopics = subjects.flatMap((s) => s.topics);
  const completedTopics = allTopics.filter((t) => t.completed).length;
  const progress = allTopics.length > 0 ? Math.round((completedTopics / allTopics.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-ink-900 dark:text-ink-50">Your Subjects</h3>
        <Button variant="secondary" type="button" onClick={addSubject}>+ Add Subject</Button>
      </div>

      {subjects.map((subject) => {
        const subjectCompleted = subject.topics.filter((t) => t.completed).length;
        const subjectProgress = subject.topics.length > 0 ? (subjectCompleted / subject.topics.length) * 100 : 0;

        return (
          <div key={subject.id} className="border border-ink-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={subject.name}
                onChange={(e) => setSubjects(subjects.map((s) => s.id === subject.id ? { ...s, name: e.target.value } : s))}
                className="font-medium text-ink-900 dark:text-ink-50 bg-transparent outline-none"
              />
              <div className="flex items-center gap-3">
                <span className="text-sm text-ink-500">{subjectCompleted}/{subject.topics.length} complete</span>
                <Button variant="ghost" type="button" onClick={() => removeSubject(subject.id)}>Remove</Button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-2 h-2 rounded-full bg-ink-100 dark:bg-ink-700 overflow-hidden">
              <div
                className="h-2 rounded-full bg-primary-600 transition-all"
                style={{ width: `${subjectProgress}%` }}
              />
            </div>

            <div className="mt-3 space-y-2">
              {subject.topics.map((topic) => (
                <div key={topic.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={topic.completed}
                    onChange={() => toggleTopic(subject.id, topic.id)}
                    className="h-5 w-5 rounded border-ink-300 text-primary-600"
                  />
                  <input
                    type="text"
                    value={topic.name}
                    onChange={(e) => {
                      setSubjects(subjects.map((s) =>
                        s.id === subject.id
                          ? { ...s, topics: s.topics.map((t) => t.id === topic.id ? { ...t, name: e.target.value } : t) }
                          : s
                      ));
                    }}
                    className={`flex-1 bg-transparent outline-none text-sm ${
                      topic.completed ? 'line-through text-ink-400' : 'text-ink-900 dark:text-ink-50'
                    }`}
                  />
                </div>
              ))}
              <Button
                variant="ghost"
                type="button"
                className="text-xs"
                onClick={() => addTopic(subject.id)}
              >
                + Add Topic
              </Button>
            </div>
          </div>
        );
      })}

      <ResultPanel>
        <ResultStat label="Overall Progress" value={`${progress}%`} emphasis />
        <ResultStat label="Topics Completed" value={completedTopics} />
        <ResultStat label="Total Topics" value={allTopics.length} />
      </ResultPanel>
    </div>
  );
}

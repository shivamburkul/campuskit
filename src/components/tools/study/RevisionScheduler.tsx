'use client';
import { useState } from 'react';
import { TextField } from '@/components/ui/Field';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';

interface RevisionPlan {
  day: string;
  date: string;
  focus: string[];
  isRepeat: boolean[];
  duration: string;
}

export function RevisionScheduler() {
  const [examDate, setExamDate] = useState('');
  const [subjects, setSubjects] = useState('Mathematics, Physics, Chemistry');

  const examDateTime = examDate ? new Date(examDate + 'T00:00:00') : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysToExam = examDateTime ? Math.ceil((examDateTime.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const subjectList = subjects.split(',').map((s) => s.trim()).filter(Boolean);

  function generatePlan(): RevisionPlan[] {
    if (daysToExam <= 0 || subjectList.length === 0) return [];

    const plan: RevisionPlan[] = [];
    const totalDays = Math.min(daysToExam, 14); // Plan for up to 14 days
    const subjectsPerDay = Math.max(1, Math.ceil(subjectList.length / totalDays));
    const seenOnce = new Set<string>();

    for (let day = 0; day < totalDays; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);

      const daySubjects: string[] = [];
      const isRepeat: boolean[] = [];
      for (let i = 0; i < subjectsPerDay; i++) {
        const idx = (day * subjectsPerDay + i) % subjectList.length;
        const subject = subjectList[idx]!;
        daySubjects.push(subject);
        // A subject appearing again later in the plan is a genuine second
        // revision pass, not a bug — flag it so the reason is obvious.
        isRepeat.push(seenOnce.has(subject));
        seenOnce.add(subject);
      }

      const isLastDay = day === totalDays - 1;
      let duration: string;
      if (isLastDay) {
        duration = 'Full day revision';
      } else if (subjectsPerDay === 1) {
        duration = '2-3 hours';
      } else {
        // Scale the time budget with how many subjects share the day, so
        // cramming several subjects into one day doesn't silently imply the
        // same 2-3 hours has to cover all of them.
        const perSubjectHours = 1.5;
        const totalHours = Math.min(8, Math.round(perSubjectHours * subjectsPerDay * 2) / 2);
        duration = `~${perSubjectHours}h per subject (${totalHours}h total)`;
      }

      plan.push({
        day: `Day ${day + 1}`,
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        focus: daySubjects,
        isRepeat,
        duration,
      });
    }

    return plan;
  }

  const plan = generatePlan();
  const subjectsPerDay = subjectList.length > 0 ? Math.max(1, Math.ceil(subjectList.length / Math.min(Math.max(daysToExam, 1), 14))) : 1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField
          label="Exam Date"
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
        />
        <TextField
          label="Subjects (comma separated)"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
        />
      </div>

      {daysToExam > 0 && subjectList.length > 0 && (
        <ResultPanel>
          <ResultStat label="Days Until Exam" value={daysToExam} emphasis />
          <ResultStat label="Subjects to Revise" value={subjectList.length} />
          {subjectsPerDay > 1 && <ResultStat label="Subjects per day" value={subjectsPerDay} />}
        </ResultPanel>
      )}

      {daysToExam > 14 && subjectList.length > 0 && (
        <InlineNote>
          Showing a rolling plan for the next 14 days — you have {daysToExam} days until the exam, so this
          plan will need to repeat or extend as the date gets closer.
        </InlineNote>
      )}

      {subjectsPerDay > 1 && plan.length > 0 && (
        <InlineNote>
          With {subjectList.length} subjects and only {Math.min(daysToExam, 14)} days, some days cover more
          than one subject, and some subjects get revised more than once — days marked &quot;2nd pass&quot; are
          intentional repeat revisions, not duplicates.
        </InlineNote>
      )}

      {plan.length > 0 && (
        <div className="space-y-3">
          {plan.map((item) => (
            <div key={item.day} className="border border-ink-100 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-ink-900 dark:text-ink-50">{item.day}</p>
                  <p className="text-sm text-ink-500">{item.date}</p>
                </div>
                <span className="text-sm text-ink-500">{item.duration}</span>
              </div>
              <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">
                Focus:{' '}
                {item.focus.map((subject, i) => (
                  <span key={i} className="font-medium">
                    {subject}
                    {item.isRepeat[i] ? ' (2nd pass)' : ''}
                    {i < item.focus.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

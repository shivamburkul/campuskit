import type { Metadata } from 'next';
import { PomodoroTimer } from '@/components/tools/study/PomodoroTimer';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('pomodoro-timer');

export default function Page() {
  return <ToolPageBody slug="pomodoro-timer" Component={PomodoroTimer} />;
}

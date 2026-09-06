import type { Metadata } from 'next';
import { SubjectWiseAttendance } from '@/components/tools/attendance/SubjectWiseAttendance';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('subject-wise-attendance');

export default function Page() {
  return <ToolPageBody slug="subject-wise-attendance" Component={SubjectWiseAttendance} />;
}

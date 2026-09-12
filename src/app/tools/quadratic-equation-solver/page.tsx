import type { Metadata } from 'next';
import { QuadraticEquationSolver } from '@/components/tools/engineering/QuadraticEquationSolver';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('quadratic-equation-solver');

export default function Page() {
  return <ToolPageBody slug="quadratic-equation-solver" Component={QuadraticEquationSolver} />;
}

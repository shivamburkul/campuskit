import type { Metadata } from 'next';
import { PolynomialSolver } from '@/components/tools/engineering/PolynomialSolver';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('polynomial-equation-solver');

export default function Page() {
  return <ToolPageBody slug="polynomial-equation-solver" Component={PolynomialSolver} />;
}

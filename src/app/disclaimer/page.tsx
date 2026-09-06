import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Disclaimer' };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-prose px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-medium text-ink-950">Disclaimer</h1>
      <div className="mt-8 space-y-5 text-ink-800">
        <p>
          CampusKit&apos;s calculators and tools are provided for general informational and convenience purposes only.
          They are not a substitute for official records, professional advice, or your institution&apos;s own systems.
        </p>
        <h2 className="font-display text-xl font-medium text-ink-950">Academic Tools</h2>
        <p>
          GPA/CGPA, attendance, and grading tools use standard, widely-used calculation methods, but grading rules vary
          by university, department, and year. Always verify results against your official transcript, gradesheet, or
          academic office before making decisions based on them.
        </p>
        <h2 className="font-display text-xl font-medium text-ink-950">Financial Tools</h2>
        <p>
          Interest, EMI, and budgeting calculators are estimates based on the inputs you provide and standard formulas.
          They are not financial advice. Loan terms, taxes, and fees vary by lender and jurisdiction — confirm exact
          figures with your bank or financial institution.
        </p>
        <h2 className="font-display text-xl font-medium text-ink-950">Document/Image Tools</h2>
        <p>
          Where CampusKit states that a tool processes files locally in your browser, that claim reflects how the tool
          is implemented at the time of writing. We do not claim any output format or size is officially accepted by a
          specific organization unless that has been separately verified and stated.
        </p>
        <h2 className="font-display text-xl font-medium text-ink-950">No Professional Advice</h2>
        <p>
          Nothing on CampusKit constitutes legal, financial, medical, or professional advice. Always consult a qualified
          professional for specific concerns.
        </p>
      </div>
    </div>
  );
}
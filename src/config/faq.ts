export const TOOL_FAQ: Record<string, { question: string; answer: string }[]> = {
  'cgpa-calculator': [
    { question: 'Does this use my university\'s official CGPA formula?', answer: 'Not automatically. Grading systems differ by university and country, so enter the SGPA and credit values from your own official transcript or gradesheet. The calculation itself (credit-weighted average) is the standard method used almost everywhere.' },
    { question: 'Is my data saved anywhere?', answer: 'No — everything you type stays in your browser tab and is not sent to any server.' },
  ],
  'attendance-classes-needed': [
    { question: 'What does "classes needed" assume?', answer: 'It assumes you attend every one of the next classes without missing any, and finds the smallest number of consecutive classes that gets you to your target percentage.' },
  ],
  'pdf-merge': [
    { question: 'Are my PDF files uploaded to a server?', answer: 'No. Merging happens entirely inside your browser using the open-source pdf-lib library — your files never leave your device.' },
    { question: 'Is there a file size limit?', answer: 'Yes, 25MB per file, mainly to keep your browser responsive on lower-end devices.' },
  ],
  'grocery-expense-splitter': [
    { question: 'What\'s the difference between "Equally" and "By item share" for a charge?', answer: '"Equally" divides that charge (e.g. delivery fee) into equal parts regardless of what each person ordered. "By item share" divides it in proportion to how much each person\'s own items cost — so someone who ordered more pays a bit more of the delivery fee too.' },
    { question: 'What happens if I don\'t tick anyone for an item?', answer: 'It\'s treated as shared equally by the whole group — useful for things like a family-size snack everyone ate from.' },
    { question: 'Is my data saved anywhere?', answer: 'No — this runs entirely in your browser tab.' },
  ],
  'image-compressor': [
    { question: 'Can I hit an exact target file size?', answer: 'The tool iteratively adjusts JPEG quality to get as close as possible to your target, but exact byte-for-byte precision isn\'t guaranteed since compression depends on image content.' },
  ],
};

export const DEFAULT_FAQ = [
  { question: 'Do I need an account to use this tool?', answer: 'No. All CampusKit tools work without signing up.' },
  { question: 'Is my data private?', answer: 'Most CampusKit tools run entirely in your browser and don\'t send your input to a server. Where a tool does need a server (rare), that will be stated on the page.' },
];

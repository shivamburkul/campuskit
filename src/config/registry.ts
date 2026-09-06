export interface ToolMeta {
  slug: string;
  title: string;
  shortTitle: string;
  category: CategoryId;
  description: string;
  longDescription?: string; // new optional field for SEO/content
  keywords: string[];
  /** true once the tool has a working implementation + tests */
  implemented: boolean;
}

export type CategoryId =
  | 'academic'
  | 'attendance'
  | 'finance'
  | 'pdf'
  | 'image'
  | 'text'
  | 'engineering'
  | 'developer'
  | 'everyday'
  | 'study';

export const CATEGORIES: Record<CategoryId, { name: string; description: string }> = {
  academic: { name: 'Academic', description: 'GPA, CGPA, percentage and grading tools.' },
  attendance: { name: 'Attendance', description: 'Track and plan class attendance.' },
  finance: { name: 'Student Finance', description: 'Budgets, splitting bills, interest and loans.' },
  pdf: { name: 'PDF Tools', description: 'Merge, compress and edit PDF files — mostly in your browser.' },
  image: { name: 'Image Tools', description: 'Resize, compress and convert images for forms and applications.' },
  text: { name: 'Text Tools', description: 'Counters, cleaners and comparison tools for text.' },
  engineering: { name: 'Engineering & Math', description: 'Calculators for engineering and STEM coursework.' },
  developer: { name: 'Developer Tools', description: 'Everyday utilities for writing and debugging code.' },
  everyday: { name: 'Everyday', description: 'Dates, time, tipping and other daily-life calculators.' },
  study: { name: 'Study & Focus', description: 'Timers and planners to help you study with less friction.' },
};

export const TOOLS: ToolMeta[] = [
  // ----------------------------------------------------------------------
  // Academic
  // ----------------------------------------------------------------------
  {
    slug: 'cgpa-calculator',
    title: 'CGPA Calculator',
    shortTitle: 'CGPA',
    category: 'academic',
    description: 'Calculate your cumulative GPA from semester-wise SGPA and credits.',
    longDescription: `The CGPA (Cumulative Grade Point Average) is one of the most important metrics in a student's academic life. It reflects your overall performance across all semesters and is often used for scholarships, higher education admissions, and job applications.

    This calculator helps you compute your CGPA by entering the SGPA (Semester Grade Point Average) and the credit hours for each semester. The formula used is the standard credit-weighted average: (sum of SGPA × credits) / total credits.

    Because grading systems vary widely across universities and countries, this tool does not assume any specific scale. You must enter your SGPA exactly as it appears on your official transcript. Always verify the final result against your university's official records before relying on it for any academic decision.`,
    keywords: ['cgpa', 'cumulative gpa', 'semester gpa'],
    implemented: true,
  },
  {
    slug: 'gpa-calculator',
    title: 'GPA Calculator',
    shortTitle: 'GPA',
    category: 'academic',
    description: 'Calculate a credit-weighted GPA from your course grades.',
    longDescription: `Your Grade Point Average (GPA) is a key indicator of your academic performance for a single semester or term. This calculator computes a credit-weighted GPA by taking each course's credit hours and grade points.

    To use it, list all your courses, their credit values, and the grade point you earned (e.g., 10, 9, 8 on a 10-point scale, or 4.0, 3.7, etc. on a US scale). The tool then calculates the weighted average: (sum of credits × grade point) / total credits.

    This method is used by most universities worldwide, but the exact grade-point boundaries differ. Always confirm your institution's official grade point equivalents and use those numbers. The result is a reliable estimate, but your official transcript remains the definitive source.`,
    keywords: ['gpa', 'grade point average'],
    implemented: true,
  },
  {
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    shortTitle: 'Percentage',
    category: 'academic',
    description: 'Convert marks to percentage, find what percent a number is of another, or calculate percentage change.',
    longDescription: `Percentages are ubiquitous in academic life — from exam scores to grade distributions. This tool provides three essential percentage calculations in one place:

    1. **Marks to percentage**: Given obtained marks and total marks, it returns the percentage score.
    2. **X is what percent of Y**: Finds what percentage one number is of another (e.g., 25 is what % of 200? → 12.5%).
    3. **Percentage change**: Computes the relative increase or decrease between two values (e.g., from 50 to 75 is a 50% increase).

    All calculations are rounded to two decimal places for clarity. Use this tool for quick checks during exam preparation, grade analysis, or any situation where you need to convert fractions to percentages.`,
    keywords: ['percentage', 'percent calculator', 'marks to percentage'],
    implemented: true,
  },
  {
    slug: 'required-marks-calculator',
    title: 'Required Marks Calculator',
    shortTitle: 'Required Marks',
    category: 'academic',
    description: 'Find the marks you need in a remaining exam to hit a target overall percentage.',
    longDescription: `This tool answers the common student question: "How many marks do I need in the final exam to achieve a certain overall percentage?"

    You provide: (1) marks obtained so far, (2) maximum marks so far, (3) maximum marks in the remaining exam(s), and (4) your target overall percentage. The calculator computes the exact marks you need to score in the remaining portion to reach your goal.

    It also tells you whether the target is achievable — if the required marks exceed the maximum possible, the goal is mathematically impossible. This helps you set realistic expectations and focus your study efforts where they matter most.`,
    keywords: ['required marks', 'target percentage', 'exam marks needed'],
    implemented: true,
  },
  {
    slug: 'target-gpa-calculator',
    title: 'Target GPA Calculator',
    shortTitle: 'Target GPA',
    category: 'academic',
    description: 'Find the GPA you need in remaining credits to reach an overall target GPA.',
    longDescription: `Setting a target GPA is a common academic strategy. This calculator helps you determine what GPA you must achieve in your remaining credits to reach your desired cumulative GPA.

    Enter your current GPA, the number of credits completed, your target overall GPA, and the remaining credits. The tool computes the required GPA for those remaining credits and indicates if it's achievable given your grading scale maximum.

    For example, if your current GPA is 7.0 on a 10-point scale, and you want to reach 8.0 overall with 20 credits remaining, the tool will tell you the GPA you need (which might be >10, meaning it's impossible). This gives you a clear picture of what you need to aim for.`,
    keywords: ['target gpa', 'required gpa', 'gpa goal'],
    implemented: true,
  },
  {
    slug: 'grade-calculator',
    title: 'Weighted Grade Calculator',
    shortTitle: 'Grade Calculator',
    category: 'academic',
    description: 'Combine assignment, midterm and final weights into a final course grade.',
    longDescription: `Many courses grade you based on multiple components (assignments, quizzes, midterm, final) each with a different weight. This tool calculates your final grade by weighting each component's score by its percentage weight.

    Simply list each component (e.g., "Assignments"), its weight percentage, and your score percentage. The tool will compute the weighted average and show your final grade. It also checks whether the total weight sums to 100% and warns you if it doesn't.

    This is useful for projecting your final grade based on current performance and planning how much effort to put into remaining components.`,
    keywords: ['grade calculator', 'weighted grade', 'final grade'],
    implemented: true,
  },

  // ----------------------------------------------------------------------
  // Attendance
  // ----------------------------------------------------------------------
  {
    slug: 'attendance-calculator',
    title: 'Attendance Percentage Calculator',
    shortTitle: 'Attendance %',
    category: 'attendance',
    description: 'Calculate your current attendance percentage instantly.',
    longDescription: `Knowing your attendance percentage is crucial because many universities require a minimum attendance (e.g., 75%) to sit for exams. This tool gives you an instant, accurate calculation.

    Enter the number of classes you have attended and the total classes held so far. The tool computes your attendance percentage and displays it clearly. It's a simple but essential check that helps you stay aware of your standing.

    Use this calculator regularly to monitor your attendance and avoid any last-minute surprises.`,
    keywords: ['attendance calculator', 'attendance percentage'],
    implemented: true,
  },
  {
    slug: 'attendance-classes-needed',
    title: 'Classes Needed for Target Attendance',
    shortTitle: 'Classes Needed',
    category: 'attendance',
    description: 'Find how many classes you need to attend in a row to hit a target attendance percentage.',
    longDescription: `If your attendance is below the required minimum, this tool tells you exactly how many consecutive classes you must attend (without missing any) to reach your target.

    Provide your current attended classes, total classes held, and your target percentage (e.g., 75%). The calculator uses the formula: (attended + x) / (total + x) = target/100, solving for x. It returns the number of classes you need to attend consecutively.

    This gives you a concrete, actionable plan to bring your attendance back to safety.`,
    keywords: ['classes needed', 'attendance shortage', 'reach 75 attendance'],
    implemented: true,
  },
  {
    slug: 'attendance-classes-can-miss',
    title: 'Classes You Can Miss',
    shortTitle: 'Can I Miss?',
    category: 'attendance',
    description: 'Find how many upcoming classes you can skip and stay above your target attendance.',
    longDescription: `Sometimes you need to skip a class, but you want to ensure you don't fall below the attendance threshold. This tool calculates the maximum number of upcoming classes you can miss while still ending the term above your target.

    You need to provide: current attended, total classes held, remaining classes, and your target percentage. The tool computes the maximum number of classes you can miss and also shows the final attendance percentage if you miss exactly that many.

    This helps you plan your schedule and make informed decisions about when to attend and when you can afford to be absent.`,
    keywords: ['classes can miss', 'skip classes attendance', 'bunk calculator'],
    implemented: true,
  },
  {
    slug: 'subject-wise-attendance',
    title: 'Subject-wise Attendance Tracker',
    shortTitle: 'Subject Tracker',
    category: 'attendance',
    description: 'Track attendance across multiple subjects at once and see which ones are at risk.',
    longDescription: `Managing attendance across several subjects can be overwhelming. This tool provides a dashboard view of your attendance for each subject, colour-coded by status:

    - **Safe**: attendance >= target
    - **Warning**: attendance is within 10% below target
    - **Shortage**: attendance is more than 10% below target

    Enter the subject name, attended classes, and total classes for each subject. The tool calculates each subject's attendance percentage and highlights the ones that need immediate attention.

    This is ideal for students who want a quick overview of all their classes and prioritize which ones to attend more regularly.`,
    keywords: ['subject wise attendance', 'attendance dashboard'],
    implemented: true,
  },

  // ----------------------------------------------------------------------
  // Finance
  // ----------------------------------------------------------------------
  {
    slug: 'expense-splitter',
    title: 'Roommate Expense Splitter',
    shortTitle: 'Split Expenses',
    category: 'finance',
    description: 'Split shared rent, groceries or trip costs fairly and see who owes whom.',
    longDescription: `Sharing expenses with roommates or friends can lead to awkward conversations about who owes what. This tool simplifies it by automatically calculating the fairest way to settle up.

    Enter each person's name and the total amount they paid. The tool computes the equal share per person and then generates a list of minimal transactions (who pays whom) to balance everything out.

    For example, if three people split a bill of ₹300, and one person paid it all, the tool will suggest that the other two pay ₹100 each to the payer. This eliminates guesswork and keeps friendships intact.`,
    keywords: ['expense splitter', 'split bills', 'roommate expenses', 'settle up'],
    implemented: true,
  },
  {
    slug: 'grocery-expense-splitter',
    title: 'Shared Grocery & Expense Splitter',
    shortTitle: 'Grocery Splitter',
    category: 'finance',
    description: 'Split an itemized grocery or group order fairly — different items per person, plus delivery, tax, fees and discounts.',
    longDescription: `This is the most comprehensive expense splitter for group orders. It handles itemized lists where each person orders different items, plus additional charges like delivery fees, taxes, or discounts.

    You can:
    - Add people and the amount they paid
    - Add items with price, quantity, and assign them to specific people (or leave unassigned for equal sharing)
    - Add charges (delivery, tax, discount) and choose whether they are split equally or proportionally based on each person's item share

    The tool calculates each person's final total, their balance (paid vs. owed), and provides a settlement plan. Everything is transparent, so there are no hidden calculations.`,
    keywords: ['grocery splitter', 'itemized bill split', 'shared order splitter', 'split delivery fee'],
    implemented: true,
  },
  {
    slug: 'simple-interest-calculator',
    title: 'Simple Interest Calculator',
    shortTitle: 'Simple Interest',
    category: 'finance',
    description: 'Calculate simple interest and total payable amount.',
    longDescription: `Simple interest is the most basic form of interest, calculated only on the principal amount. This tool computes the interest and total amount after a given period.

    Enter the principal amount, annual interest rate, and time in years. The tool calculates: Interest = Principal × Rate × Time / 100. It also shows the total amount (principal + interest).

    Use this for quick estimates on small loans, savings, or any scenario where interest does not compound.`,
    keywords: ['simple interest calculator'],
    implemented: true,
  },
  {
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator',
    shortTitle: 'Compound Interest',
    category: 'finance',
    description: 'Calculate compound interest with custom compounding frequency.',
    longDescription: `Compound interest is interest on interest — it can significantly increase your savings or debt over time. This calculator allows you to choose the compounding frequency (annually, semi-annually, quarterly, monthly, or daily).

    Enter the principal, annual interest rate, number of years, and compounding frequency. The tool calculates the total amount and the interest earned. It uses the standard formula: A = P(1 + r/n)^(nt).

    This is essential for understanding how your investments grow or how loans accumulate interest.`,
    keywords: ['compound interest calculator'],
    implemented: true,
  },
  {
    slug: 'emi-calculator',
    title: 'EMI / Loan Calculator',
    shortTitle: 'EMI Calculator',
    category: 'finance',
    description: 'Calculate monthly EMI, total interest and total payment for a loan.',
    longDescription: `An Equated Monthly Instalment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. This calculator computes the EMI based on the loan amount, interest rate, and tenure (in months).

    The formula used is the standard reducing-balance method: EMI = P × r × (1+r)^n / ((1+r)^n – 1), where P is principal, r is monthly interest rate, and n is number of monthly instalments.

    The tool also shows the total interest payable and the total payment over the loan tenure. This helps you plan your budget and compare loan options.`,
    keywords: ['emi calculator', 'loan calculator'],
    implemented: true,
  },
  {
    slug: 'savings-goal-calculator',
    title: 'Savings Goal Calculator',
    shortTitle: 'Savings Goal',
    category: 'finance',
    description: 'Find out how many months it will take to reach a savings goal.',
    longDescription: `Setting a savings goal is the first step toward financial discipline. This calculator tells you how many months you need to save to reach a target amount, given your current savings and monthly contribution.

    Enter your target amount, current savings, and monthly contribution. The tool calculates the number of months needed (rounded up) and indicates if the goal is already met.

    This is useful for planning large purchases, emergency funds, or any long-term savings objective.`,
    keywords: ['savings goal calculator'],
    implemented: true,
  },

  // ----------------------------------------------------------------------
  // PDF
  // ----------------------------------------------------------------------
  {
    slug: 'pdf-merge',
    title: 'Merge PDF',
    shortTitle: 'Merge PDF',
    category: 'pdf',
    description: 'Combine multiple PDF files into one — processed entirely in your browser.',
    longDescription: `Merging PDFs is a common need — whether combining scanned documents, consolidating lecture notes, or creating a single file for submission. This tool allows you to upload multiple PDF files and merge them into one document.

    All processing happens locally in your browser using the open-source pdf-lib library. Your files are never uploaded to any server, ensuring privacy and security.

    You can reorder the files by dragging or using the up/down buttons, and the tool displays a thumbnail of each file's first page for easy identification. The merged PDF is then available for download.`,
    keywords: ['merge pdf', 'combine pdf'],
    implemented: true,
  },
  {
    slug: 'pdf-split',
    title: 'Split PDF',
    shortTitle: 'Split PDF',
    category: 'pdf',
    description: 'Extract a page range from a PDF into a new file, entirely in your browser.',
    longDescription: `Often you only need a few pages from a large PDF document. This tool lets you extract a specific page range (e.g., pages 5-10) and save it as a new PDF.

    Upload your PDF, specify the page range (using formats like "1-3" or "1,4,7-9"), and the tool extracts those pages. All processing is done client-side, so your documents remain private.

    The tool also shows the total number of pages detected, so you can easily specify a valid range.`,
    keywords: ['split pdf', 'extract pdf pages'],
    implemented: true,
  },
  {
    slug: 'image-to-pdf',
    title: 'JPG/PNG to PDF',
    shortTitle: 'Image → PDF',
    category: 'pdf',
    description: 'Combine images into a single PDF document, in your browser.',
    longDescription: `If you have multiple images (e.g., scanned documents, photos) that you want to combine into a single PDF, this tool is for you. You can upload JPG or PNG images, and the tool will create a PDF with one image per page.

    All processing is done locally using pdf-lib. The images are embedded at their original resolution, and the resulting PDF is available for download.

    This is perfect for creating a PDF from photos, converting image-based notes, or preparing documents for submission.`,
    keywords: ['jpg to pdf', 'png to pdf', 'image to pdf'],
    implemented: true,
  },

  // ----------------------------------------------------------------------
  // Image
  // ----------------------------------------------------------------------
  {
    slug: 'image-compressor',
    title: 'Image Compressor',
    shortTitle: 'Compress Image',
    category: 'image',
    description: 'Compress JPG/PNG images to a target size for form uploads, entirely in your browser.',
    longDescription: `Many online forms (job applications, visa applications, etc.) have strict file size limits for photos. This tool helps you compress your images to a target size without sacrificing too much quality.

    Upload a JPG or PNG image, set a target size in KB, and the tool will iteratively adjust JPEG quality to get as close as possible to that size. The compression happens entirely in your browser using the Canvas API — your image is never uploaded.

    The tool shows the original and compressed sizes, and you can download the compressed version. It supports WebP output in addition to JPEG, making it versatile for different use cases.`,
    keywords: ['image compressor', 'compress image', 'reduce image size'],
    implemented: true,
  },
  {
    slug: 'image-resizer',
    title: 'Image Resizer',
    shortTitle: 'Resize Image',
    category: 'image',
    description: 'Resize images to exact pixel dimensions, e.g. for passport photos.',
    longDescription: `Resizing images to specific dimensions is often required for passport photos, signatures, or online profiles. This tool allows you to resize your images to any width and height in pixels.

    Upload a JPG or PNG image, then enter your desired dimensions. You can lock the aspect ratio to maintain proportions, or unlock it for custom stretching. The tool also provides preset sizes like passport photo (413×531) and signature (140×60) for quick use.

    The resized image is rendered using the Canvas API and downloaded in the same format as the original (or JPEG with high quality). All processing is done locally.`,
    keywords: ['image resizer', 'resize photo', 'passport photo size'],
    implemented: true,
  },
  {
    slug: 'image-format-converter',
    title: 'Image Format Converter',
    shortTitle: 'Convert Image',
    category: 'image',
    description: 'Convert between JPG, PNG and WebP in your browser.',
    longDescription: `Sometimes you need to change an image's format to meet a website's requirements or to reduce file size. This tool allows you to convert between JPG, PNG, and WebP formats.

    Upload an image, select the desired output format, and the tool will convert it instantly using the Canvas API. All processing is client-side, so your images remain private.

    The tool also supports WebP, which offers better compression than JPG/PNG, making it ideal for web use.`,
    keywords: ['jpg to png', 'png to jpg', 'webp converter'],
    implemented: true,
  },

  // ----------------------------------------------------------------------
  // Text
  // ----------------------------------------------------------------------
  {
    slug: 'word-counter',
    title: 'Word & Character Counter',
    shortTitle: 'Word Counter',
    category: 'text',
    description: 'Count words, characters, sentences and estimate reading time.',
    longDescription: `Whether you're writing an essay, a blog post, or a social media caption, knowing your word and character counts is essential. This tool provides a detailed analysis of your text.

    It counts:
    - Words
    - Characters (with and without spaces)
    - Sentences
    - Paragraphs
    - Lines
    - Estimated reading time (based on 200 words per minute)
    - Estimated speaking time (based on 130 words per minute)

    Simply paste or type your text into the input area, and get instant feedback. This is a must-have for writers, students, and anyone who needs to meet length requirements.`,
    keywords: ['word counter', 'character counter', 'reading time calculator'],
    implemented: true,
  },
  {
    slug: 'text-cleaner',
    title: 'Remove Extra Spaces & Duplicate Lines',
    shortTitle: 'Text Cleaner',
    category: 'text',
    description: 'Clean up messy pasted text: trim spaces, remove duplicate or empty lines, sort lines.',
    longDescription: `Copying text from websites, PDFs, or emails often brings unwanted formatting — extra spaces, empty lines, duplicate lines, inconsistent line endings. This tool offers a suite of operations to clean up your text.

    Available operations:
    - Trim each line (remove leading/trailing spaces)
    - Collapse spaces (turn multiple spaces into one)
    - Remove extra spaces (trim + collapse)
    - Remove empty lines
    - Remove duplicate lines (with case-sensitive or -insensitive option)
    - Sort lines (ascending or descending)
    - Normalize line endings (convert CRLF/CR to LF)

    Each operation is applied in-place, so you can combine them in any order. This saves immense time when preparing text for submissions or further processing.`,
    keywords: ['remove extra spaces', 'remove duplicate lines', 'text cleaner'],
    implemented: true,
  },
  {
    slug: 'find-and-replace',
    title: 'Find and Replace',
    shortTitle: 'Find & Replace',
    category: 'text',
    description: 'Find and replace text, with optional regular-expression support.',
    longDescription: `This powerful tool lets you perform bulk text replacements. You can search for a specific string and replace it with another, either as a literal match or using regular expressions.

    Features:
    - Case-sensitive or case-insensitive matching
    - Regular expression support for advanced patterns
    - Immediate preview of the result

    This is invaluable for editing large documents, code, or any text where you need to make systematic changes quickly.`,
    keywords: ['find and replace', 'text replace tool'],
    implemented: true,
  },
  {
    slug: 'text-diff',
    title: 'Text Comparison (Diff)',
    shortTitle: 'Text Diff',
    category: 'text',
    description: 'Compare two blocks of text and see what changed, line by line.',
    longDescription: `When you have two versions of a document, essay, or code, it's essential to see exactly what changed. This tool provides a clear, line-by-line comparison using a word-level diff.

    It highlights:
    - Added lines (in green)
    - Removed lines (in red)
    - Changed lines (showing removed and added parts inline)

    The summary tells you how many lines were added, removed, changed, or unchanged. You can also hide unchanged lines for a focused view. This is perfect for peer reviews, editing, and version control.`,
    keywords: ['text diff', 'compare text', 'text comparison tool'],
    implemented: true,
  },

  // ----------------------------------------------------------------------
  // Engineering
  // ----------------------------------------------------------------------
  {
    slug: 'unit-converter',
    title: 'Unit Converter',
    shortTitle: 'Unit Converter',
    category: 'engineering',
    description: 'Convert length, weight, volume, area, speed and data units.',
    longDescription: `Converting between units is a frequent task in science, engineering, and daily life. This tool supports six categories: Length, Weight, Volume, Area, Speed, and Data.

    For each category, you can choose the "from" and "to" units and enter a value. The tool instantly converts using precise multipliers. Temperature conversion is also available separately.

    This is a one-stop solution for all your unit conversion needs, whether you're doing homework, cooking, or planning a trip.`,
    keywords: ['unit converter'],
    implemented: true,
  },
  {
    slug: 'number-base-converter',
    title: 'Number Base Converter',
    shortTitle: 'Base Converter',
    category: 'engineering',
    description: 'Convert between binary, decimal, octal and hexadecimal.',
    longDescription: `Number systems are fundamental in computer science and electronics. This tool allows you to convert numbers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16).

    Enter a number and select the source and target bases. The tool will convert it correctly, handling large numbers and validating input.

    This is essential for computer engineering students, programmers, and anyone working with low-level data representation.`,
    keywords: ['binary to decimal', 'number base converter', 'hex converter'],
    implemented: true,
  },
  {
    slug: 'statistics-calculator',
    title: 'Mean, Median, Mode & Std Deviation',
    shortTitle: 'Statistics',
    category: 'engineering',
    description: 'Calculate mean, median, mode, variance and standard deviation for a dataset.',
    longDescription: `Descriptive statistics are crucial for analyzing data in science, engineering, and business. This tool computes the key statistical measures for a list of numbers.

    Enter your dataset as comma- or space-separated numbers. The tool calculates:
    - Count
    - Sum
    - Mean (average)
    - Median (middle value)
    - Mode (most frequent values)
    - Min and Max
    - Variance
    - Standard deviation

    The results are clearly displayed, making it easy to understand your data's central tendency and spread.`,
    keywords: ['mean median mode calculator', 'standard deviation calculator'],
    implemented: true,
  },
  {
    slug: 'ohms-law-calculator',
    title: "Ohm's Law Calculator",
    shortTitle: "Ohm's Law",
    category: 'engineering',
    description: 'Calculate voltage, current, resistance or power from any two known values.',
    longDescription: `Ohm's Law is a fundamental principle in electrical engineering: V = I × R. This calculator lets you solve for any variable given the other two, and also computes power (P = V × I).

    Select what you want to solve for (voltage, current, resistance, or power), enter the known values, and the tool will compute the missing one.

    This is an essential companion for any electronics lab, helping you quickly check circuit values and verify calculations.`,
    keywords: ["ohm's law calculator", 'voltage current resistance calculator'],
    implemented: true,
  },

  // ----------------------------------------------------------------------
  // Developer
  // ----------------------------------------------------------------------
  {
    slug: 'json-formatter',
    title: 'JSON Formatter & Validator',
    shortTitle: 'JSON Formatter',
    category: 'developer',
    description: 'Format, validate and minify JSON.',
    longDescription: `JSON is everywhere in modern web development. This tool helps you work with JSON data by formatting it for readability or minifying it for production.

    You can:
    - Paste raw JSON and format it with proper indentation
    - Validate the structure and get error messages
    - Minify to a compact string for API responses or storage

    The tool uses JSON.parse internally, so it's safe and reliable. It's indispensable for debugging APIs, editing config files, or just making JSON human-readable.`,
    keywords: ['json formatter', 'json validator', 'json minifier'],
    implemented: true,
  },
  {
    slug: 'base64-tool',
    title: 'Base64 Encoder / Decoder',
    shortTitle: 'Base64',
    category: 'developer',
    description: 'Encode or decode Base64 text.',
    longDescription: `Base64 encoding is used to represent binary data as ASCII text, often for embedding images in HTML/CSS or transmitting data in JSON. This tool provides both encoding and decoding.

    Enter text to encode to Base64, or paste Base64 to decode back to plain text. The tool handles Unicode characters correctly using URI encoding/decoding internally.

    This is a quick and reliable utility for developers working with data encoding.`,
    keywords: ['base64 encode', 'base64 decode'],
    implemented: true,
  },
  {
    slug: 'url-encoder',
    title: 'URL Encoder / Decoder',
    shortTitle: 'URL Encode',
    category: 'developer',
    description: 'Encode or decode URL components.',
    longDescription: `URL encoding (percent-encoding) is used to convert special characters in URLs to a safe format. This tool lets you encode or decode any string.

    Enter a string to encode it for use in a URL, or paste an encoded string to decode it back to its original form. The tool uses encodeURIComponent/decodeURIComponent, which is the standard JavaScript method.

    This is useful for building query strings, handling user input in URLs, or debugging URL-related issues.`,
    keywords: ['url encoder', 'url decoder'],
    implemented: true,
  },
  {
    slug: 'uuid-generator',
    title: 'UUID Generator',
    shortTitle: 'UUID Generator',
    category: 'developer',
    description: 'Generate random UUID v4 identifiers.',
    longDescription: `UUIDs (Universally Unique Identifiers) are used to uniquely identify objects in distributed systems. This tool generates random UUIDs following the version 4 format.

    You can specify how many UUIDs to generate (up to 100). The tool uses the browser's crypto.randomUUID() method when available, with a fallback for older browsers.

    This is ideal for creating unique IDs for database records, temporary tokens, or any scenario where you need a unique identifier.`,
    keywords: ['uuid generator', 'guid generator'],
    implemented: true,
  },
  {
    slug: 'jwt-decoder',
    title: 'JWT Decoder',
    shortTitle: 'JWT Decoder',
    category: 'developer',
    description: 'Decode a JWT header and payload — entirely client-side, no signature verification.',
    longDescription: `JWT (JSON Web Token) is a popular method for authentication. This tool decodes the header and payload of a JWT without verifying the signature (which cannot be done client-side securely).

    Paste a JWT string, and the tool will split it into its three parts, decode the base64-encoded header and payload, and display them as JSON.

    This is useful for inspecting the contents of a token during development. **Important:** Never paste a JWT from a production environment into any tool, including this one, unless you trust it completely.`,
    keywords: ['jwt decoder', 'decode jwt'],
    implemented: true,
  },
  {
    slug: 'timestamp-converter',
    title: 'Unix Timestamp Converter',
    shortTitle: 'Timestamp',
    category: 'developer',
    description: 'Convert between Unix timestamps and human-readable dates.',
    longDescription: `Unix timestamps (seconds since 1970-01-01) are widely used in databases and APIs. This tool lets you convert between timestamps and ISO date strings.

    You can:
    - Enter a timestamp to see the corresponding date/time
    - Enter a date/time to get the timestamp
    - Use the "current time" button to get the current timestamp

    This is essential for developers working with time-based data, debugging logs, or setting expiration dates.`,
    keywords: ['unix timestamp converter', 'epoch converter'],
    implemented: true,
  },
  {
    slug: 'color-converter',
    title: 'HEX / RGB / HSL Converter',
    shortTitle: 'Color Converter',
    category: 'developer',
    description: 'Convert colors between HEX, RGB and HSL.',
    longDescription: `Colors are represented in different formats across design and development. This tool converts between HEX (e.g., #28926E), RGB (e.g., rgb(40, 146, 110)), and HSL.

    Enter a HEX color value, and the tool will display its RGB and HSL equivalents. It also shows a preview of the color.

    This is useful for designers and developers who need to switch between color formats in their work.`,
    keywords: ['hex to rgb', 'rgb to hex', 'color converter'],
    implemented: true,
  },

  // ----------------------------------------------------------------------
  // Everyday
  // ----------------------------------------------------------------------
  {
    slug: 'age-calculator',
    title: 'Age Calculator',
    shortTitle: 'Age Calculator',
    category: 'everyday',
    description: 'Calculate exact age in years, months and days.',
    longDescription: `Whether you're filling out a form, checking eligibility, or just curious, this tool calculates your exact age from a birth date.

    Enter your date of birth, and the tool will show:
    - Age in years, months, and days
    - Total days, weeks, hours, minutes, and seconds (calculated from calendar dates)

    Note that the totals are based on full days elapsed, not the exact current instant (since time of birth is not considered). This is accurate for most practical purposes.`,
    keywords: ['age calculator'],
    implemented: true,
  },
  {
    slug: 'date-difference-calculator',
    title: 'Date Difference Calculator',
    shortTitle: 'Date Difference',
    category: 'everyday',
    description: 'Find the number of days, months and years between two dates.',
    longDescription: `This tool computes the exact difference between two dates, giving you the result in years, months, and days. It also shows the total days, weeks, hours, and minutes.

    Simply enter the "from" and "to" dates, and the tool handles the rest. The calculation is independent of order (it will always give a positive difference).

    This is useful for planning projects, tracking durations, or any scenario where you need to measure time intervals.`,
    keywords: ['date difference calculator', 'days between dates'],
    implemented: true,
  },
  {
    slug: 'business-days-calculator',
    title: 'Business Days Calculator',
    shortTitle: 'Business Days',
    category: 'everyday',
    description: 'Count working days between two dates, excluding weekends.',
    longDescription: `When planning projects, deliveries, or official work, you often need to count only weekdays (Monday to Friday). This tool calculates the number of business days between two dates, excluding weekends.

    Enter the start and end dates, and the tool will count the days, skipping Saturdays and Sundays. It does not account for public holidays, but you can manually adjust if needed.

    This is essential for project management, estimating lead times, and any business-related scheduling.`,
    keywords: ['business days calculator', 'working days calculator'],
    implemented: true,
  },
  {
    slug: 'tip-calculator',
    title: 'Tip Calculator',
    shortTitle: 'Tip Calculator',
    category: 'everyday',
    description: 'Calculate tip amount and split the bill between people.',
    longDescription: `Dining out with friends? This tool helps you calculate the tip and split the total bill fairly.

    Enter the bill amount, the tip percentage (e.g., 10%, 15%, 20%), and the number of people sharing. The tool computes:
    - Tip amount
    - Total bill (bill + tip)
    - Amount per person

    This removes the awkward math and ensures everyone pays their fair share.`,
    keywords: ['tip calculator'],
    implemented: true,
  },
  {
    slug: 'discount-calculator',
    title: 'Discount Calculator',
    shortTitle: 'Discount Calculator',
    category: 'everyday',
    description: 'Calculate the final price after a percentage discount.',
    longDescription: `Shopping sales and discounts are everywhere, but it's easy to get confused about the final price. This tool calculates the final price after a discount.

    Enter the original price and the discount percentage. The tool will show:
    - The discount amount you save
    - The final price you pay

    This is perfect for quickly checking whether a deal is worth it, especially during sales or when comparing prices.`,
    keywords: ['discount calculator'],
    implemented: true,
  },

  // ----------------------------------------------------------------------
  // Study
  // ----------------------------------------------------------------------
  {
    slug: 'pomodoro-timer',
    title: 'Pomodoro Timer',
    shortTitle: 'Pomodoro',
    category: 'study',
    description: 'A focus timer using the Pomodoro technique — runs fully offline.',
    longDescription: `The Pomodoro Technique is a time management method that breaks work into intervals (typically 25 minutes) separated by short breaks. This tool implements a fully functional Pomodoro timer that runs in your browser.

    You can:
    - Set the focus duration (default 25 min)
    - Set the break duration (default 5 min)
    - Start, pause, and reset the timer
    - Track the number of completed sessions

    All data stays in your browser; nothing is tracked or uploaded. This is a great way to boost productivity and maintain focus during study or work.`,
    keywords: ['pomodoro timer', 'study timer'],
    implemented: true,
  },
  {
    slug: 'exam-countdown',
    title: 'Exam Countdown Timer',
    shortTitle: 'Exam Countdown',
    category: 'study',
    description: 'Count down the days, hours and minutes to your next exam.',
    longDescription: `Exams are stressful, but having a clear countdown can help you stay motivated and organized. This tool shows the remaining time until a specific exam date/time.

    Enter the date and time of your exam, and the tool will display the days, hours, minutes, and seconds remaining. It updates in real-time.

    This is a simple but powerful way to keep your goal in sight and manage your preparation schedule.`,
    keywords: ['exam countdown', 'countdown timer'],
    implemented: true,
  },
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: CategoryId): ToolMeta[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getImplementedTools(): ToolMeta[] {
  return TOOLS.filter((t) => t.implemented);
}
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ArticleContent {
  title: string;
  description: string;
  date: string;
  content: string[];
  tools: { name: string; slug: string }[];
}

const articles: Record<string, ArticleContent> = {
  'cgpa-gpa-guide': {
    title: 'The Ultimate Guide to CGPA & GPA for Students',
    description: 'Understand how CGPA and GPA are calculated, why they matter, and how to use CampusKit to track your academic progress.',
    date: 'September 10, 2026',
    content: [
      'Your CGPA (Cumulative Grade Point Average) is one of the most important numbers in your academic life. It determines your eligibility for scholarships, higher education, and even job opportunities. But many students don\'t fully understand how it is calculated.',
      'In this guide, we\'ll break down the concept of CGPA and GPA, explain the standard calculation methods, and show you how you can use CampusKit to track your progress accurately.',
      'CGPA is typically calculated by weighting the grade points of each subject or semester by the credits they carry. The CampusKit CGPA Calculator allows you to enter the SGPA (Semester GPA) and credits for each semester, and it does the rest for you. This is especially helpful for planning which semesters you need to focus on.',
    ],
    tools: [
      { name: 'CGPA Calculator', slug: 'cgpa-calculator' },
      { name: 'GPA Calculator', slug: 'gpa-calculator' },
      { name: 'Target GPA Calculator', slug: 'target-gpa-calculator' },
    ],
  },
  'fix-attendance-shortage': {
    title: 'How to Fix Your Attendance Shortage (Step-by-Step)',
    description: 'Are you below the minimum attendance? This guide shows you exactly how many classes you need to attend and what you can safely miss.',
    date: 'September 10, 2026',
    content: [
      'Attendance requirements are a common source of stress for students. If your attendance falls below the minimum (usually 75%), you might be barred from exams. But you can plan your way out of this situation.',
      'The first step is to know exactly where you stand. Use the Attendance Percentage Calculator to calculate your current percentage. Then, use the Classes Needed for Target Attendance tool to find out how many classes you need to attend consecutively to get back above the threshold.',
      'If you are already above the required percentage, the Classes You Can Miss tool tells you how many future classes you can safely skip without falling below the target. Planning ahead with these tools can save you from last-minute panic.',
    ],
    tools: [
      { name: 'Attendance Calculator', slug: 'attendance-calculator' },
      { name: 'Classes Needed', slug: 'attendance-classes-needed' },
      { name: 'Classes Can Miss', slug: 'attendance-classes-can-miss' },
    ],
  },
  'student-finance-tools': {
    title: '5 Student Finance Tools You Need Before Your First Job',
    description: 'From EMI calculators to interest calculators, these tools will help you make smart financial decisions as a student.',
    date: 'September 10, 2026',
    content: [
      'Managing money as a student is hard. Between shared expenses with roommates, education loans, and saving for the future, the numbers can get confusing quickly.',
      'CampusKit includes several finance tools built specifically for student life. The Expense Splitter helps you settle shared bills fairly. The EMI Calculator shows what your education loan repayments will look like. Simple and compound interest calculators help you understand savings growth and loan costs.',
      'Start using these tools early — financial literacy before your first job puts you ahead of most of your peers.',
    ],
    tools: [
      { name: 'Expense Splitter', slug: 'expense-splitter' },
      { name: 'EMI Calculator', slug: 'emi-calculator' },
      { name: 'Simple Interest', slug: 'simple-interest-calculator' },
      { name: 'Compound Interest', slug: 'compound-interest-calculator' },
      { name: 'Savings Goal', slug: 'savings-goal-calculator' },
    ],
  },
  'text-tools-guide': {
    title: 'The Complete Guide to Text Tools for Writers & Students',
    description: 'From word counting to cleaning messy text, this guide covers every text tool on CampusKit that will save you hours of manual work.',
    date: 'September 10, 2026',
    content: [
      'Whether you are writing an assignment, cleaning up notes, or comparing two versions of a document, text tools save time.',
      'The Word Counter gives you instant counts of words, characters, sentences and reading time. The Text Cleaner removes extra spaces, empty lines and duplicates. Find and Replace works across large blocks of text, and the Text Diff tool highlights exactly what changed between two versions.',
    ],
    tools: [
      { name: 'Word Counter', slug: 'word-counter' },
      { name: 'Text Cleaner', slug: 'text-cleaner' },
      { name: 'Find and Replace', slug: 'find-and-replace' },
      { name: 'Text Diff', slug: 'text-diff' },
    ],
  },
  'developer-tools-guide': {
    title: 'Every Developer Tool You Need in One Place',
    description: 'JSON formatting, Base64 encoding, UUID generation, JWT decoding and more — this guide shows you how to use every developer utility on CampusKit.',
    date: 'September 10, 2026',
    content: [
      'Developers constantly need small utilities — format JSON, encode a string, generate a UUID, decode a JWT. Switching between a dozen websites is slow and often means pasting sensitive data into unknown servers.',
      'CampusKit runs these tools in your browser. JSON formatting and validation is instant. Base64 encoding and decoding stays on your device. UUID generation, JWT decoding and timestamp conversion are all available without leaving the page.',
    ],
    tools: [
      { name: 'JSON Formatter', slug: 'json-formatter' },
      { name: 'Base64 Tool', slug: 'base64-tool' },
      { name: 'UUID Generator', slug: 'uuid-generator' },
      { name: 'JWT Decoder', slug: 'jwt-decoder' },
    ],
  },
  'sgpa-guide': {
    title: 'SGPA vs CGPA: What\'s the Difference and How to Calculate Both',
    description: 'SGPA measures a single semester, CGPA measures your whole degree so far. Here\'s how each is calculated and when to use which.',
    date: 'September 12, 2026',
    content: [
      'SGPA (Semester Grade Point Average) and CGPA (Cumulative Grade Point Average) use the same underlying formula — credits multiplied by grade points, divided by total credits — but over different scopes. SGPA looks at one semester in isolation. CGPA rolls every semester you\'ve completed into a single number.',
      'This distinction matters because a single bad semester affects your SGPA a lot, but its effect on your CGPA shrinks as more semesters get added to the average. If you\'re trying to recover from a rough semester, it helps to calculate exactly what SGPA you need going forward to bring your CGPA back to a target — rather than guessing.',
      'A common mistake is treating SGPA and CGPA as interchangeable when reporting to recruiters or applications that ask specifically for one or the other. Always check which one is being requested, since a strong final-semester SGPA can look very different from an average CGPA across your whole degree.',
    ],
    tools: [
      { name: 'SGPA Calculator', slug: 'sgpa-calculator' },
      { name: 'CGPA Calculator', slug: 'cgpa-calculator' },
      { name: 'Target GPA Calculator', slug: 'target-gpa-calculator' },
    ],
  },
  'exam-score-guide': {
    title: 'How Negative Marking Actually Affects Your Exam Score',
    description: 'A wrong answer doesn\'t just cost you a mark — it costs you the mark you would have gained, twice over. Here\'s the math behind negative marking.',
    date: 'September 12, 2026',
    content: [
      'Negative marking schemes deduct a fraction of a mark (commonly 1/4 or 1/3) for each incorrect answer, on top of not awarding the mark for a correct one. This creates an asymmetry that\'s easy to underestimate: guessing randomly on a four-option question has a 25% chance of gaining a mark and a 75% chance of losing a fraction of one — usually a net negative expected value.',
      'This is why "attempt everything" isn\'t always the right exam strategy under negative marking. If you can eliminate two of four options, a guess becomes a better bet; if you have no idea, it usually isn\'t. Knowing your exam\'s exact penalty fraction changes this calculation, so always check the marking scheme before deciding how aggressively to guess.',
      'After the exam, calculating your actual score requires tracking correct, incorrect, and unattempted questions separately, then applying the penalty only to the incorrect ones. Doing this by hand across 100+ questions is error-prone — a calculator built for the specific marking scheme removes that risk.',
    ],
    tools: [
      { name: 'Exam Score Calculator', slug: 'exam-score-calculator' },
      { name: 'UPSC Prelims Score Calculator', slug: 'upsc-prelims-calculator' },
      { name: 'Percentage Calculator', slug: 'percentage-calculator' },
    ],
  },
  'study-planner-guide': {
    title: 'Building a Study Schedule That Survives Contact With Reality',
    description: 'Most study plans fall apart by day three. Here\'s how to build one around your actual available hours instead of your ideal ones.',
    date: 'September 12, 2026',
    content: [
      'The most common reason study plans fail isn\'t lack of discipline — it\'s that they\'re built around an idealized version of your schedule rather than the one you actually have. A plan that assumes six uninterrupted hours a day rarely survives the first day with an unplanned commitment.',
      'A more durable approach starts from your real, fixed commitments (classes, work, sleep) and fills in study blocks around them, subject by subject, rather than the reverse. Breaking subjects into small, trackable chunks — a topic per session rather than "study Physics for 3 hours" — also makes it much easier to notice when you\'re falling behind early enough to adjust.',
      'As an exam date approaches, the plan needs to shift from steady coverage to targeted revision, prioritizing weaker subjects and topics you haven\'t touched recently. A rigid plan that doesn\'t adapt to how the weeks actually go is often worse than a rough plan you keep adjusting.',
    ],
    tools: [
      { name: 'Study Planner', slug: 'study-planner' },
      { name: 'Revision Scheduler', slug: 'revision-scheduler' },
      { name: 'Pomodoro Timer', slug: 'pomodoro-timer' },
      { name: 'Study Session Tracker', slug: 'study-session-tracker' },
    ],
  },
  'budget-guide': {
    title: 'A Simple Monthly Budget System for Students',
    description: 'You don\'t need a finance degree to budget well — just a clear split between needs, wants, and savings, and a way to track it.',
    date: 'September 12, 2026',
    content: [
      'A widely used starting point for budgeting is splitting income roughly into needs (rent, food, transport), wants (entertainment, eating out), and savings — often as a 50/30/20 split, though the exact ratios matter less than having any consistent split at all.',
      'For students specifically, income is often irregular (a stipend, part-time work, or an allowance from family), which makes tracking categories over a full month more useful than trying to budget week by week. Recording actual expenses as they happen, even roughly, reveals patterns that guessing never will — most people underestimate how much goes to small, frequent purchases.',
      'The goal isn\'t a perfect spreadsheet — it\'s enough visibility to catch a category running over before the month ends, when there\'s still time to adjust.',
    ],
    tools: [
      { name: 'Monthly Budget Calculator', slug: 'monthly-budget-calculator' },
      { name: 'Expense Splitter', slug: 'expense-splitter' },
      { name: 'Savings Goal Calculator', slug: 'savings-goal-calculator' },
    ],
  },
  'regex-guide': {
    title: 'Regular Expressions for People Who Keep Forgetting the Syntax',
    description: 'A practical, example-first look at the regex patterns you\'ll actually use, and how to test them safely before running them on real data.',
    date: 'September 12, 2026',
    content: [
      'Regular expressions have a reputation for being unreadable, but most everyday use cases only need a handful of building blocks: character classes like [a-z] or \\d, quantifiers like + and *, and anchors like ^ and $. Almost everything else is a variation on these.',
      'The most common regex mistake isn\'t syntax — it\'s testing on too small a sample. A pattern that works on your one example input can fail silently on edge cases (empty strings, extra whitespace, unexpected casing) that only show up once you run it on real data. Testing against several deliberately awkward examples before trusting a pattern catches most of these early.',
      'A subtler issue is the "catastrophic backtracking" trap, where certain nested quantifier patterns can make a regex engine hang on specific inputs. If a pattern that matched instantly during testing suddenly takes seconds on slightly different input, that\'s usually the cause — simplifying the pattern is almost always the fix.',
    ],
    tools: [
      { name: 'Regex Tester', slug: 'regex-tester' },
      { name: 'Find and Replace', slug: 'find-and-replace' },
    ],
  },
  'matrix-guide': {
    title: 'Matrix Operations Explained: Determinant, Inverse, and Why They Matter',
    description: 'What a determinant actually tells you, when a matrix has no inverse, and how these ideas show up in real engineering and computer science problems.',
    date: 'September 12, 2026',
    content: [
      'A determinant is a single number computed from a square matrix that tells you, among other things, whether the matrix is invertible: a zero determinant means the matrix is singular and has no inverse, no matter how you compute it. Geometrically, the determinant also represents how much a transformation scales area (in 2D) or volume (in 3D) — a determinant of zero means the transformation collapses space into a lower dimension.',
      'The inverse of a matrix, when it exists, is what "undoes" the transformation that matrix represents — multiplying a matrix by its inverse always gives the identity matrix. This is the matrix equivalent of dividing by a number, which is also why a matrix with determinant zero (the matrix equivalent of zero) has no inverse, mirroring why you can\'t divide by zero.',
      'These aren\'t just abstract exercises — solving systems of linear equations, computer graphics transformations, and many machine learning algorithms all rely on matrix inversion and determinants under the hood. Computing them by hand for anything larger than 3×3 is tedious and error-prone, which is exactly the kind of repetitive, precise work a calculator should handle.',
    ],
    tools: [
      { name: 'Matrix Calculator', slug: 'matrix-calculator' },
      { name: 'Vector Calculator', slug: 'vector-calculator' },
    ],
  },
  'permutation-combination-guide': {
    title: 'Permutations vs Combinations: How to Tell Them Apart Instantly',
    description: 'The one question that resolves every permutation-vs-combination confusion: does order matter here?',
    date: 'September 12, 2026',
    content: [
      'Permutations and combinations both count ways of selecting items from a group, and the formulas look similar enough that it\'s easy to grab the wrong one under exam pressure. The single question that resolves the confusion every time: does the order of selection matter for this problem?',
      'Choosing 3 people for a committee is a combination — there\'s no "first," "second," or "third" committee member, just a group. Choosing a president, vice-president, and treasurer from the same 3 people is a permutation — the same three people in different roles counts as a different outcome. Same group size, same pool, different answer, because order matters in one case and not the other.',
      'Once you\'ve identified which one applies, the formulas themselves are mechanical: permutations divide by (n-r)!, combinations divide by (n-r)!r! to additionally cancel out the orderings within the selection that don\'t matter. Getting the setup right matters far more than memorizing the formula.',
    ],
    tools: [
      { name: 'Permutation & Combination Calculator', slug: 'permutation-combination-calculator' },
      { name: 'Probability Distribution Calculator', slug: 'probability-distribution-calculator' },
    ],
  },
  'scientific-calculator-guide': {
    title: 'Getting the Most Out of a Scientific Calculator (Beyond the Basics)',
    description: 'DEG vs RAD, memory keys, and why your calculator gives a different answer than your friend\'s — a practical walkthrough.',
    date: 'September 12, 2026',
    content: [
      'The single most common scientific calculator mistake is leaving it in the wrong angle mode. sin(30) equals 0.5 in degree mode but a completely different number in radian mode — if your answer looks wildly off for a trig problem, checking DEG vs RAD first saves a lot of confused troubleshooting.',
      'Memory keys (M+, M-, MR, MC) exist to avoid re-typing intermediate results, which is also where manual transcription errors creep in. Storing a subtotal in memory rather than writing it down and re-entering it removes an entire category of mistakes, especially in multi-step problems.',
      'Order of operations still applies inside a calculator exactly as it does on paper — parentheses aren\'t optional decoration, they change the actual answer. A calculator that correctly handles nested parentheses and operator precedence will give a different (correct) result than one that evaluates strictly left to right, so it\'s worth understanding which behavior yours has.',
    ],
    tools: [
      { name: 'Scientific Calculator', slug: 'scientific-calculator' },
      { name: 'Quadratic Equation Solver', slug: 'quadratic-equation-solver' },
      { name: 'Polynomial Equation Solver', slug: 'polynomial-equation-solver' },
    ],
  },
  'time-zone-guide': {
    title: 'Why Time Zone Math Is Harder Than It Looks',
    description: 'Daylight saving, half-hour offsets, and the date line all conspire to make "just add the hours" wrong. Here\'s what actually works.',
    date: 'September 12, 2026',
    content: [
      'Time zones aren\'t evenly spaced hour offsets from UTC — India is UTC+5:30, Nepal is UTC+5:45, and several regions shift by an extra hour for part of the year under daylight saving. "Just add 9.5 hours" works until the specific date you\'re converting falls on the wrong side of a daylight saving transition, at which point the answer is off by exactly one hour.',
      'This is why converting a specific date and time between zones is safer than memorizing a fixed offset between two cities — the correct offset can change twice a year in places that observe daylight saving, and doesn\'t change at all in places that don\'t. Scheduling something for "next month" across zones is a common place this trips people up.',
      'For quick day-to-day comparisons rather than scheduling a specific event, a live comparison of the current time difference between two places is usually enough, and skips the daylight-saving edge cases entirely since it\'s always evaluated for right now.',
    ],
    tools: [
      { name: 'Time Zone Converter', slug: 'time-zone-converter' },
      { name: 'World Clock', slug: 'world-clock' },
    ],
  },
  'gst-guide': {
    title: 'GST Explained: Inclusive vs Exclusive Pricing',
    description: 'The same 18% GST rate gives two different base prices depending on whether it\'s already included in the sticker price. Here\'s the formula for both.',
    date: 'September 12, 2026',
    content: [
      'When a price is GST-exclusive, the tax is added on top: a ₹1,000 item at 18% GST costs ₹1,180 at checkout. When a price is GST-inclusive, the ₹1,180 sticker price already contains the tax, and the pre-tax base price has to be worked backward — it isn\'t simply ₹1,180 minus 18%, since 18% of ₹1,180 isn\'t the same amount as 18% of the original base price.',
      'The correct way to reverse an inclusive price is to divide by (1 + tax rate), not multiply by (1 - tax rate) — for 18% GST, that means dividing by 1.18, not multiplying by 0.82. Using the wrong formula understates the tax component and overstates the base price, which matters for accurate invoicing and expense tracking.',
      'This distinction comes up constantly for freelancers and small businesses quoting prices, since whether a quote is "plus GST" or "GST included" changes the actual amount a client pays, even when the headline number looks the same.',
    ],
    tools: [
      { name: 'GST Calculator', slug: 'gst-calculator' },
      { name: 'Discount Calculator', slug: 'discount-calculator' },
    ],
  },
  'academic-progress-guide': {
    title: 'How to Tell If You\'re Actually on Track for Your Target GPA',
    description: 'Raw GPA tells you where you\'ve been. This guide covers how to calculate where you need to go from here.',
    date: 'September 12, 2026',
    content: [
      'Your current GPA is a backward-looking average — it tells you how you\'ve performed so far, but not whether your target GPA is still realistically reachable given how many credits you have left. Two students with the same current GPA can be in very different positions if one has 100 credits remaining and the other has 10.',
      'The calculation that actually answers "am I on track" works backward from the target: given your current GPA and credits completed, and your target GPA and total credits, what average GPA do you need across your remaining credits to get there? If that required average exceeds the maximum possible GPA on your scale, the target isn\'t mathematically reachable anymore, and it\'s better to know that early than to find out at graduation.',
      'This reframing turns a vague goal ("I want a 9.0 CGPA") into a concrete, checkable number each semester, which makes it much easier to notice — and correct for — falling behind before it compounds.',
    ],
    tools: [
      { name: 'Academic Progress Calculator', slug: 'academic-progress-calculator' },
      { name: 'Target GPA Calculator', slug: 'target-gpa-calculator' },
      { name: 'CGPA Calculator', slug: 'cgpa-calculator' },
    ],
  },
  'hash-generator-guide': {
    title: 'MD5 vs SHA-256: What Hashing Is Actually For',
    description: 'Hashing isn\'t encryption, and not all hash functions are safe for the same job. Here\'s when to reach for which one.',
    date: 'September 12, 2026',
    content: [
      'A hash function takes any input and produces a fixed-length "fingerprint" of it — the same input always produces the same hash, and changing even one character produces a completely different one. Unlike encryption, hashing is one-way: you can\'t recover the original input from the hash, which is exactly the point for tasks like verifying a file wasn\'t corrupted or tampered with.',
      'MD5 is fast and still fine for basic checksums (confirming a downloaded file matches the original), but it\'s cryptographically broken — it\'s possible to deliberately construct two different inputs that produce the same MD5 hash, which makes it unsafe for anything security-sensitive like password storage or digital signatures.',
      'SHA-256 (and its relatives) don\'t have that weakness and are the standard choice for security-relevant hashing today. The practical rule: use SHA-256 or better for anything involving security or trust, and reserve MD5 for quick, non-adversarial integrity checks where speed matters more than cryptographic strength.',
    ],
    tools: [
      { name: 'Hash Generator', slug: 'hash-generator' },
    ],
  },
  'image-cropper-guide': {
    title: 'Cropping and Editing Images Without Losing Quality',
    description: 'The most common way people accidentally ruin a photo while "just cropping it" — and how to avoid it.',
    date: 'September 12, 2026',
    content: [
      'The most common way a "simple crop" quietly ruins image quality is a tool that renders your edit through a small on-screen preview and then exports that same low-resolution preview as the final file — even if you never touched a single adjustment slider. The fix isn\'t about compression settings at all; it\'s making sure the final export is always rendered from the original full-resolution image, with the crop and any adjustments applied fresh, not from whatever was drawn on screen for you to look at.',
      'A second common frustration is a destructive workflow: crop, then realize you cut off too much, then have to start over from the original file because the crop can\'t be adjusted afterward. A non-destructive editor keeps your original image untouched in the background, so reopening the crop tool always lets you expand or adjust the selection rather than being stuck with what you already committed to.',
      'Beyond cropping, small adjustments — brightness, contrast, saturation, a quick rotation — are often all a photo needs before sharing or submitting it, without reaching for full photo-editing software for something that takes ten seconds.',
    ],
    tools: [
      { name: 'Image Editor', slug: 'image-editor' },
      { name: 'Image Compressor', slug: 'image-compressor' },
      { name: 'Image Resizer', slug: 'image-resizer' },
    ],
  },
  'case-converter-guide': {
    title: 'camelCase, snake_case, kebab-case: A Field Guide',
    description: 'Every naming convention you\'ll run into as a developer, what it\'s used for, and how to convert between them instantly.',
    date: 'September 12, 2026',
    content: [
      'camelCase (myVariableName) is the convention for variables and functions in JavaScript, Java, and many other languages. snake_case (my_variable_name) dominates Python and database column names. kebab-case (my-variable-name) shows up in URLs and CSS class names, since most languages don\'t allow hyphens in identifiers. PascalCase (MyClassName) is reserved for class and type names in most style guides.',
      'Mixing conventions within a single codebase is a common source of small but persistent friction — a function expecting snake_case keys silently failing against an API returning camelCase is a classic, easy-to-miss bug. Consistently converting at the boundary between systems (e.g. right where you receive an API response) avoids this class of issue entirely.',
      'Manually retyping a long variable name into a different case is slow and error-prone, especially across dozens of occurrences — a straightforward find-and-convert saves time and avoids the copy-paste mistakes that come with doing it by hand.',
    ],
    tools: [
      { name: 'Case Converter', slug: 'case-converter' },
      { name: 'Find and Replace', slug: 'find-and-replace' },
    ],
  },
  'compress-pdf-guide': {
    title: 'Why Some PDFs Compress 90% and Others Barely Shrink at All',
    description: 'PDF compression depends entirely on what\'s inside the file. Here\'s how to tell which kind of PDF you have before you try.',
    date: 'September 12, 2026',
    content: [
      'A PDF\'s size mostly comes from one of two places: embedded images (photos, scanned pages) or native text and vector content. These compress completely differently — a scanned document is really just a sequence of full-resolution photographs, and re-encoding those photos at a lower quality can shrink the file by 70-90% with barely noticeable visual loss.',
      'A PDF that\'s mostly typed text, on the other hand, is already extremely compact in its native form — the text is stored as instructions ("draw this character here"), not as pixels. Trying to "compress" such a file by converting it to images almost always makes it larger, not smaller, since a full-page image of plain text takes far more data than the same text stored natively.',
      'The practical takeaway: check whether your PDF is scanned/image-heavy or text-based before choosing a compression approach. Image-based compression is the right tool for the first case and actively counterproductive for the second — a good compressor should detect which situation you\'re in rather than applying the same approach blindly.',
    ],
    tools: [
      { name: 'Compress PDF', slug: 'compress-pdf' },
      { name: 'PDF to Image', slug: 'pdf-to-image' },
    ],
  },
  'study-session-tracker-guide': {
    title: 'Why Tracking Study Time Beats Tracking Study Plans',
    description: 'A plan tells you what you intended to do. A tracked log tells you what you actually did — and that gap is where real improvement happens.',
    date: 'September 12, 2026',
    content: [
      'Most people significantly overestimate how much focused study time they actually get in a day. A plan that says "3 hours of Physics" describes an intention; a timer that logs the actual start and stop times reveals whether that intention became reality — and by how much it typically falls short.',
      'The value of tracking isn\'t the discipline theater of watching a number tick up — it\'s the data it produces over time. A week of logged sessions shows which subjects consistently get shortchanged, which times of day produce the longest uninterrupted sessions, and whether total study time is actually trending up or just feels like it is.',
      'Pairing a session tracker with short, timed focus blocks (the Pomodoro technique is a common version of this) tends to produce more honest logs than open-ended "study until done" sessions, since a defined start and end makes it much harder to lose track of when you actually stopped focusing.',
    ],
    tools: [
      { name: 'Study Session Tracker', slug: 'study-session-tracker' },
      { name: 'Pomodoro Timer', slug: 'pomodoro-timer' },
      { name: 'Study Planner', slug: 'study-planner' },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
  };
}

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-prose px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">{article.date}</p>
      <h1 className="mt-2 font-display text-3xl font-medium text-ink-950 dark:text-ink-50">{article.title}</h1>
      <p className="mt-2 text-lg text-ink-700 dark:text-ink-200">{article.description}</p>

      <div className="mt-8 space-y-5 text-ink-800 dark:text-ink-200">
        {article.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {article.tools.length > 0 && (
        <div className="mt-8 rounded-xl border border-white/30 bg-white/30 p-6 shadow-lg shadow-black/5 backdrop-blur-[24px] saturate-180 dark:border-white/10 dark:bg-ink-900/70 dark:shadow-black/30">
          <h2 className="font-display text-lg font-medium text-ink-950 dark:text-ink-50">Tools mentioned in this guide</h2>
          <ul className="mt-3 space-y-2">
            {article.tools.map((tool) => (
              <li key={tool.slug}>
                <Link href={`/tools/${tool.slug}`} className="text-primary-600 underline dark:text-primary-400">
                  {tool.name} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 border-t border-white/30 pt-6 dark:border-white/10">
        <Link href="/blog" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400">
          ← Back to all guides
        </Link>
      </div>
    </div>
  );
}

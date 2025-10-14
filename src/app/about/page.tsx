import Link from "next/link";

const sections = [
  {
    title: "Version 0 – Weighted Random",
    summary:
      "The original computer opponent pulls from a simple random generator. Every round is independent, so the computer has an equal chance to throw rock, paper, or scissors regardless of how the player has been performing.",
    details: [
      "Internally the strategy selects one of the three moves with uniform probability using Math.random().",
      "Because each turn is independent, the computer never learns from player behavior, making it predictable only in the sense that it never adapts.",
    ],
  },
  {
    title: "Version 1 – Adaptive Markov Model",
    summary:
      "The newer strategy starts with a weighted opening move and then adapts based on recent history. It tries to exploit common player reactions to previous outcomes.",
    details: [
      "On the very first round the computer favors paper (36%), scissors (33%), and then rock (31%) to mirror how frequently people typically start.",
      "After at least one completed round it falls back to a single-order Markov chain. The computer reviews the last outcome and predicts how the player is likely to respond next.",
      "If the player just won, the model assumes they will repeat the winning move and therefore throws the counter that beats it. If the player just lost, it expects them to switch to the move that would have beaten the computer and counters that instead. After a draw, it anticipates a small rotation and throws the move that would beat that follow-up.",
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center px-6 py-24 text-left">
      <div className="flex w-full max-w-3xl flex-col gap-10">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wide">About the Computer Strategies</h1>
          <p className="text-lg text-white/80">
            Rock Paper Scissors on this site ships with two different computer opponents. Each version uses a distinct algorithm
            so you can experiment with predictable play and adaptive counter-strategies.
          </p>
        </header>
        <div className="flex flex-col gap-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl bg-white/10 p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold uppercase tracking-wide">{section.title}</h2>
              <p className="mt-4 text-base text-white/80">{section.summary}</p>
              <ul className="mt-4 list-disc space-y-3 pl-6 text-base text-white/70">
                {section.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Back to the game
          </Link>
        </div>
      </div>
    </main>
  );
}

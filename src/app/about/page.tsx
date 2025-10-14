import Link from "next/link";

const sections = [
  {
    title: "Kindergarden – Weighted Random Probabilities",
    summary:
      "The original computer opponent pulls from a simple random generator. The probability of the computer's move is based on empirical data synthesized from multiple studies.",
    details: [
      "Internally the strategy selects one of the three moves with the probabilities:  31% rock, 36% paper, and 33% scissors.",
      "Because each turn is independent, the computer never learns from player behavior, making it predictable only in the sense that it never adapts.",
    ],
  },
  {
    title: "Elementary – Single Order Markov Model",
    summary:
      "Version 1 starts with a weighted opening move from Version 0 and then adapts based on the players last turn. It does this through a single order Markov chain.",
    details: [
      "If the player just won, the model assumes they will repeat the winning move and therefore throws the counter to that move. Ex. If the player wins with rock, the computer will play paper.",
      "If the player just lost, it expects them to switch to the move that would have beaten the computer and counters that instead. Ex. If the player loses with paper, the computer will play rock.",
      "After a draw, it anticipates that the player will play what wins against what was just thrown. Ex. There is a tie with scissors, the computer will play paper.",
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

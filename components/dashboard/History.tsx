"use client";

const history = [
  { type: "Frontend", score: 8 },
  { type: "Backend", score: 7 },
  { type: "Data Analyst", score: 6 },
];

export default function History() {
  return (
    <div className="glass border border-border rounded-2xl p-6 h-[300px]">
      <h3 className="text-lg font-semibold mb-4">History</h3>

      <div className="space-y-4">
        {history.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b border-border pb-2"
          >
            <span className="text-sm">{item.type}</span>
            <span className="text-sm text-muted-foreground">
              {item.score}/10
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
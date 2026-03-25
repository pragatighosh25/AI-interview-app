"use client";

type Interview = {
  score: number;
};

export default function Stats({ data }: { data: Interview[] }) {
  const total = data.length;

  const avg =
    total > 0
      ? (data.reduce((acc, item) => acc + item.score, 0) / total).toFixed(1)
      : 0;

  const best =
    total > 0
      ? Math.max(...data.map((i) => i.score)).toFixed(1)
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      
      {/* Avg */}
      <div className="glass border border-border rounded-2xl p-5">
        <p className="text-sm text-muted-foreground">Average Score</p>
        <h2 className="text-2xl font-bold gradient-text">
          {avg} / 10
        </h2>
      </div>

      {/* Best */}
      <div className="glass border border-border rounded-2xl p-5">
        <p className="text-sm text-muted-foreground">Best Score</p>
        <h2 className="text-2xl font-bold text-green-500">
          {best} / 10
        </h2>
      </div>

      {/* Total */}
      <div className="glass border border-border rounded-2xl p-5">
        <p className="text-sm text-muted-foreground">Total Interviews</p>
        <h2 className="text-2xl font-bold">
          {total}
        </h2>
      </div>
    </div>
  );
}
import { SignupRecord } from "../types/form";

type SignupHistoryProps = {
  history: SignupRecord[];
  onClear: () => void;
};

export default function SignupHistory({
  history,
  onClear,
}: SignupHistoryProps) {
  if (!history.length) {
    return null;
  }

  return (
    <section className="history">
      <div className="history__header">
        <h3>Recent signups</h3>
        <button
          type="button"
          className="ghost-btn"
          onClick={onClear}
          aria-label="Clear recent signup history"
        >
          Clear history
        </button>
      </div>
      <ul>
        {history.map((entry) => (
          <li key={`${entry.email}-${entry.timestamp}`}>
            <strong>{entry.email}</strong>
            <span>
              {new Date(entry.timestamp).toLocaleString(undefined, {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

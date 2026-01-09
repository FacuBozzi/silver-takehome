import { RuleState } from "../hooks/usePasswordStrength";

type PasswordChecklistProps = {
  rules: RuleState[];
};

export default function PasswordChecklist({ rules }: PasswordChecklistProps) {
  return (
    <div className="password-checklist">
      {rules.map(({ label, passed }) => (
        <div
          key={label}
          className={`password-check ${passed ? "pass" : "fail"}`}
        >
          <span aria-hidden="true">{passed ? "✔" : "•"}</span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

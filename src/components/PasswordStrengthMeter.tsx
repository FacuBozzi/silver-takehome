type PasswordStrengthMeterProps = {
  label: string;
  percent: number;
  passedRules: number;
};

export default function PasswordStrengthMeter({
  label,
  percent,
  passedRules,
}: PasswordStrengthMeterProps) {
  return (
    <div className="strength-meter" aria-live="polite">
      <div className="strength-meter__header">
        <span>Password strength</span>
        <strong>{label}</strong>
      </div>
      <div className="strength-meter__track">
        <span
          className={`strength-meter__fill strength-${passedRules}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

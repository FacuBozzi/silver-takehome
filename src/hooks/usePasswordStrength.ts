import { useMemo } from "react";
import { passwordRuleChecks } from "../utils/validation";

const strengthLabels = ["Needs work", "Fair", "Strong", "Excellent"];

export type RuleState = {
  label: string;
  passed: boolean;
};

export const usePasswordStrength = (password: string) => {
  const ruleStates: RuleState[] = useMemo(
    () =>
      passwordRuleChecks.map(({ label, check }) => ({
        label,
        passed: check(password),
      })),
    [password],
  );

  const passedRules = useMemo(
    () => ruleStates.filter((rule) => rule.passed).length,
    [ruleStates],
  );

  const totalRules = passwordRuleChecks.length;

  const percent = useMemo(
    () => Math.round((passedRules / totalRules) * 100),
    [passedRules, totalRules],
  );

  const label = strengthLabels[passedRules] ?? strengthLabels[0];

  return {
    ruleStates,
    passedRules,
    totalRules,
    percent,
    label,
  };
};

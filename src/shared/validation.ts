export function validateRegexPattern(pattern: string): string | null {
  const value = pattern.trim();

  if (!value) {
    return null;
  }

  try {
    new RegExp(value);
    return null;
  } catch {
    return '正则表达式无效，该规则不会参与生效。';
  }
}

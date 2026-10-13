const BADGE_MAX_WIDTH = 4;

function getCharacterWidth(char: string) {
  return char.charCodeAt(0) <= 127 ? 1 : 2;
}

export function getProfileBadge(name: string) {
  const normalized = name.replace(/\s+/g, '').trim();

  if (!normalized) {
    return '配';
  }

  const defaultNameMatch = normalized.match(/^配置(\d+)$/);

  if (defaultNameMatch?.[1]) {
    return defaultNameMatch[1];
  }

  let width = 0;
  let badge = '';

  for (const char of Array.from(normalized)) {
    const nextWidth = width + getCharacterWidth(char);

    if (nextWidth > BADGE_MAX_WIDTH) {
      break;
    }

    badge += char;
    width = nextWidth;
  }

  return badge;
}

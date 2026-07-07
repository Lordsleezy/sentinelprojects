export type ResolutionResult = {
  canonicalName: string;
  confidence: number;
  source: string;
  history: string[];
};

const suffixPattern = /\b(the|llc|l\.l\.c\.|inc|inc\.|corporation|corp|corp\.|company|co|co\.|limited|ltd|lp|partners|development|developers)\b/gi;

export function resolveEntityName(name: string, knownNames: string[] = []): ResolutionResult {
  const normalized = normalizeEntityName(name);
  const match = knownNames
    .map((known) => ({ known, normalized: normalizeEntityName(known), distance: levenshtein(normalized, normalizeEntityName(known)) }))
    .filter((item) => item.normalized && item.distance <= Math.max(2, Math.floor(normalized.length * 0.12)))
    .sort((a, b) => a.distance - b.distance)[0];

  if (match) {
    return {
      canonicalName: titleCase(match.known),
      confidence: match.distance === 0 ? 0.98 : 0.82,
      source: "name-normalization",
      history: [name, match.known],
    };
  }

  return {
    canonicalName: titleCase(name.trim()),
    confidence: 0.72,
    source: "direct-name",
    history: [name],
  };
}

export function normalizeEntityName(value: string) {
  return value
    .toLowerCase()
    .replace(suffixPattern, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function titleCase(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
    .replace(/\bLlc\b/g, "LLC")
    .replace(/\bInc\b/g, "Inc.");
}

function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return matrix[a.length][b.length];
}


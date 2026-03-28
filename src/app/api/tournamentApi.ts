export interface AuthoritativeTournamentMatch {
  match: string;
  number: number;
  played: string[];
  result: Record<string, number>;
  winner: string;
}

export interface MatchData {
  match: number;
  [playerId: string]: number;
}

const NPOINT_URL = 'https://api.npoint.io/9e9b4019fec4946a0f9a';

export async function fetchTournamentMatches(): Promise<AuthoritativeTournamentMatch[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(NPOINT_URL, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Match API returned ${response.status} ${response.statusText}`);
    }

    const body = await response.json();
    if (!Array.isArray(body)) {
      throw new Error('Tournament data API returned unexpected schema (expected array).');
    }

    return body.map((item: any, idx: number) => ({
      match: String(item?.match),
      number: Number(item?.number),
      played: Array.isArray(item?.played) ? item.played.filter((x: any) => typeof x === 'string') : [],
      result: item?.result && typeof item.result === 'object' ? item.result : {},
      winner: String(item?.winner),
    }));
  } finally {
    clearTimeout(timeout);
  }
}

export function normalizeTournamentMatchData(
  rawMatches: any[],
  playerIds: string[]
): MatchData[] {
  if (!Array.isArray(rawMatches)) return [];

  return rawMatches.map((item, index) => {
    const matchNumber = Number(item?.number ?? item?.match ?? index + 1);
    const resultRecord = (item?.result && typeof item.result === 'object' && !Array.isArray(item.result))
      ? item.result
      : {};

    const normalized: MatchData = { match: Number.isFinite(matchNumber) ? matchNumber : index + 1 };

    playerIds.forEach(pid => {
      const value = resultRecord[pid];
      normalized[pid] = typeof value === 'number' ? value : 0;
    });

    return normalized;
  });
}

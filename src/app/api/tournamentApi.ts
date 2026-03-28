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

const NPOINT_URL = 'https://api.npoint.io/1941bdc1e76382a20072';

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
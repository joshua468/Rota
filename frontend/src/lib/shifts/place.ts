export type Place = {
  kind: 'zoom' | 'meet' | 'teams' | 'remote' | 'place';
  label: string;
  url?: string;
};

export function toPlace(s: { meetingUrl?: string; location?: string }): Place | null {
  const url = s.meetingUrl?.trim();
  const loc = s.location?.trim();
  if (url) {
    let host = '';
    try {
      host = new URL(url).hostname;
    } catch {
      host = '';
    }
    if (host === 'zoom.us' || host.endsWith('.zoom.us')) return { kind: 'zoom', label: 'Zoom', url };
    if (host === 'meet.google.com') return { kind: 'meet', label: 'Meet', url };
    if (host.endsWith('teams.microsoft.com') || host.endsWith('teams.live.com')) {
      return { kind: 'teams', label: 'Teams', url };
    }
    return { kind: 'remote', label: 'Online', url };
  }
  if (loc && /zoom/i.test(loc)) return { kind: 'zoom', label: 'Zoom' };
  if (loc && /^(remote|online|virtual)$/i.test(loc)) return { kind: 'remote', label: 'Remote' };
  return loc ? { kind: 'place', label: loc } : null;
}

export const placeIcon = (p: Place): 'map-pin' | 'video' =>
  p.kind === 'place' ? 'map-pin' : 'video';

import { describe, expect, it } from 'vitest';
import { placeIcon, toPlace } from './place';

describe('toPlace', () => {
  it('detects Zoom links', () => {
    expect(toPlace({ meetingUrl: 'https://zoom.us/j/123456789' })).toEqual({
      kind: 'zoom',
      label: 'Zoom',
      url: 'https://zoom.us/j/123456789',
    });
    expect(toPlace({ meetingUrl: 'https://acme.zoom.us/j/1' })?.kind).toBe('zoom');
  });

  it('detects Google Meet links', () => {
    expect(toPlace({ meetingUrl: 'https://meet.google.com/abc-defg-hij' })).toEqual({
      kind: 'meet',
      label: 'Meet',
      url: 'https://meet.google.com/abc-defg-hij',
    });
  });

  it('detects Microsoft Teams links', () => {
    expect(toPlace({ meetingUrl: 'https://teams.microsoft.com/l/meetup-join/xyz' })?.kind).toBe('teams');
    expect(toPlace({ meetingUrl: 'https://teams.live.com/meet/123' })?.kind).toBe('teams');
  });

  it('falls back to an online link for unknown hosts', () => {
    expect(toPlace({ meetingUrl: 'https://example.com/call' })).toEqual({
      kind: 'remote',
      label: 'Online',
      url: 'https://example.com/call',
    });
  });

  it('reads the location text when there is no link', () => {
    expect(toPlace({ location: 'Zoom' })).toEqual({ kind: 'zoom', label: 'Zoom' });
    expect(toPlace({ location: 'Remote' })).toEqual({ kind: 'remote', label: 'Remote' });
    expect(toPlace({ location: 'Room 402' })).toEqual({ kind: 'place', label: 'Room 402' });
  });

  it('returns null when there is no place', () => {
    expect(toPlace({})).toBeNull();
    expect(toPlace({ location: '   ' })).toBeNull();
    expect(toPlace({ meetingUrl: '  ' })).toBeNull();
  });
});

describe('placeIcon', () => {
  it('uses a map pin only for physical places', () => {
    expect(placeIcon({ kind: 'place', label: 'Room 402' })).toBe('map-pin');
    expect(placeIcon({ kind: 'zoom', label: 'Zoom' })).toBe('video');
    expect(placeIcon({ kind: 'meet', label: 'Meet' })).toBe('video');
  });
});

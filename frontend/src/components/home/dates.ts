const WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const fmtTitle = (d: Date) => `${WD[d.getDay()] ?? ''}, ${d.getDate()} ${MO[d.getMonth()] ?? ''}`;
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
export const weekdayShort = (d: Date) => (WD[d.getDay()] ?? '').toUpperCase();
export const relLabel = (d: Date, today = new Date()) => {
  const diff = Math.round((+new Date(d.toDateString()) - +new Date(today.toDateString())) / 864e5);
  return diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : diff === -1 ? 'Yesterday' : (WD[d.getDay()] ?? '');
};
export const timeOfDay = (hour: number) => (hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening');

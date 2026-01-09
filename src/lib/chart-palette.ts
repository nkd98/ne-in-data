const seriesMuted = ['#111111', '#4B4B4B', '#6B6B6B', '#8C8C8C', '#A3A3A3', '#C2C2C2'];

export const chartPalette = {
  background: '#FFFFFF',
  ink: '#111111',
  axis: '#4B4B4B',
  muted: '#6B6B6B',
  light: '#9A9A9A',
  grid: '#E0E0E0',
  accent: '#D32F2F',
  accentDark: '#B71C1C',
  series: ['#D32F2F', ...seriesMuted],
  seriesMulti: [
    '#D32F2F',
    '#4E79A7',
    '#59A14F',
    '#F28E2B',
    '#76B7B2',
    '#B07AA1',
    '#9C755F',
    '#EDC948',
    '#BAB0AC',
  ],
  seriesMuted,
};

const highlightMatchers = [
  /north[-\s]?east/i,
  /\bnortheast\b/i,
  /\bne\b/i,
  /loss/i,
  /decline/i,
  /decrease/i,
  /small/i,
  /rural/i,
  /surfaced/i,
];

const benchmarkMatchers = [/all india/i, /\bindia\b/i, /\btotal\b/i, /overall/i];

export const pickHighlightSeriesIndex = (seriesNames: string[]) => {
  if (seriesNames.length <= 1) return 0;
  for (const matcher of highlightMatchers) {
    const idx = seriesNames.findIndex((name) => matcher.test(name));
    if (idx !== -1) return idx;
  }
  if (seriesNames.some((name) => benchmarkMatchers.some((matcher) => matcher.test(name)))) {
    const idx = seriesNames.findIndex(
      (name) => !benchmarkMatchers.some((matcher) => matcher.test(name))
    );
    if (idx !== -1) return idx;
  }
  return undefined;
};

export const pickHighlightIndexByTotals = (seriesValues: number[][]) => {
  if (!seriesValues.length) return undefined;
  const totals = seriesValues.map((values) =>
    values.reduce((sum, val) => (Number.isFinite(val) ? sum + val : sum), 0)
  );
  const max = Math.max(...totals);
  if (!Number.isFinite(max) || max <= 0) return undefined;
  return totals.indexOf(max);
};

export const buildSeriesColorMap = (
  seriesNames: string[],
  highlightIndex?: number,
  palette: string[] = chartPalette.seriesMuted
) => {
  const normalizedAccent = chartPalette.accent.toLowerCase();
  const basePalette = highlightIndex != null
    ? palette.filter((color) => color.toLowerCase() !== normalizedAccent)
    : palette;
  const colors = seriesNames.map(
    (_, idx) => basePalette[idx % basePalette.length]
  );
  if (highlightIndex != null && seriesNames[highlightIndex]) {
    colors[highlightIndex] = chartPalette.accent;
  }
  return Object.fromEntries(seriesNames.map((name, idx) => [name, colors[idx]]));
};

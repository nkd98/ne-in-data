import { chartPalette } from './chart-palette';

export const chartFontFamily = 'var(--font-body, Inter, system-ui, sans-serif)';

export const chartTextStyle = {
  fontFamily: chartFontFamily,
  color: chartPalette.ink,
  fontSize: 12,
};

export const buildAxisTitleStyle = (fontSize = 12) => ({
  fontFamily: chartFontFamily,
  fontWeight: 700,
  fontSize,
  color: chartPalette.ink,
});

export const buildAxisLabelStyle = (fontSize = 12) => ({
  fontFamily: chartFontFamily,
  fontSize,
  color: chartPalette.axis,
});

export const buildLegendTextStyle = (fontSize = 12) => ({
  fontFamily: chartFontFamily,
  fontSize,
  color: chartPalette.ink,
});

export const chartAxisLineStyle = {
  lineStyle: { color: chartPalette.grid },
};

export const chartSplitLineStyle = {
  lineStyle: { color: chartPalette.grid, opacity: 0.4 },
};

export const buildTooltipStyle = (fontSize = 12) => ({
  backgroundColor: chartPalette.background,
  borderColor: chartPalette.grid,
  borderWidth: 1,
  confine: true,
  padding: 10,
  textStyle: {
    color: chartPalette.ink,
    fontFamily: chartFontFamily,
    fontSize,
  },
});

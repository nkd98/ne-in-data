import { chartPalette } from './chart-palette';

export const vegaTheme = {
  background: "transparent",
  axis: {
    gridColor: chartPalette.grid,
    gridOpacity: 1,
    domain: false,
    labelColor: chartPalette.axis,
    titleColor: chartPalette.ink,
    labelFont: "Plus Jakarta Sans",
    titleFont: "Plus Jakarta Sans",
    labelFontSize: 12,
    titleFontSize: 12,
    titleFontWeight: "medium",
    labelPadding: 8,
    titlePadding: 12,
  },
  legend: {
    labelColor: chartPalette.axis,
    titleColor: chartPalette.ink,
    labelFont: "Plus Jakarta Sans",
    titleFont: "Plus Jakarta Sans",
    titleFontWeight: "medium",
  },
  view: { stroke: "transparent" },
  range: { category: chartPalette.series }
};

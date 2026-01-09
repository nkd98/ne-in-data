export const DEFAULT_WATERMARK_TEXT = 'NorthEast in Data';

type WatermarkOptions = {
  text?: string;
  top?: number;
  right?: number;
  fontSize?: number;
  paddingX?: number;
  boxHeight?: number;
};

export const buildWatermarkGraphic = (options: WatermarkOptions = {}) => {
  const text = options.text ?? DEFAULT_WATERMARK_TEXT;
  const border = 'rgba(17, 17, 17, 0.45)';
  const background = 'rgba(255, 255, 255, 0.9)';
  const fontSize = options.fontSize ?? 5;
  const paddingX = options.paddingX ?? 2;
  const boxHeight = options.boxHeight ?? fontSize + 6;
  const approxCharWidth = fontSize * 0.75;
  const boxWidth = Math.max(102, Math.ceil(text.length * approxCharWidth + paddingX * 2 + 6));
  const fontFamily = 'var(--font-body, Inter, system-ui, sans-serif)';

  return [
    {
      type: 'group',
      silent: true,
      zlevel: 10,
      z: 100,
      right: options.right ?? 8,
      top: options.top ?? 8,
      width: boxWidth,
      height: boxHeight,
      children: [
        {
          type: 'rect',
          shape: { x: 0, y: 0, width: boxWidth, height: boxHeight },
          style: { fill: background, stroke: border, lineWidth: 1 },
        },
        {
          type: 'text',
          x: paddingX,
          y: boxHeight / 2,
          style: {
            text: '{brand|NorthEast} {rest|in Data}',
            fontSize,
            lineHeight: boxHeight,
            textAlign: 'left',
            textVerticalAlign: 'middle',
            width: boxWidth - paddingX * 2,
            overflow: 'truncate',
            ellipsis: '',
            fontFamily,
            fontWeight: 400,
            rich: {
              brand: { fill: '#d1434b', fontWeight: 400 },
              rest: { fill: '#111', fontWeight: 400 },
            },
          },
        },
      ],
    },
  ];
};

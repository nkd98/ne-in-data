type ExportOptions = {
  instance: any;
  title: string;
  filename: string;
  watermark?: string;
};

const truncateText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const trimmed = text.trim();
  if (!trimmed) return '';
  if (ctx.measureText(trimmed).width <= maxWidth) return trimmed;
  let output = trimmed;
  const suffix = '...';
  while (output.length > 0 && ctx.measureText(output + suffix).width > maxWidth) {
    output = output.slice(0, -1);
  }
  return output ? `${output}${suffix}` : trimmed;
};

export const downloadChartImage = ({ instance, title, filename, watermark = '' }: ExportOptions) => {
  if (!instance) return;
  const dataUrl = instance.getDataURL({ type: 'png', pixelRatio: 3, backgroundColor: '#fff' });
  const image = new Image();

  image.onload = () => {
    const padding = Math.max(12, Math.round(image.width * 0.02));
    const titleFont = Math.max(16, Math.min(28, Math.round(image.width * 0.025)));
    const watermarkFont = Math.max(10, Math.min(14, Math.round(image.width * 0.012)));
    const titlePad = title ? Math.round(titleFont * 1.6) : 0;

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height + titlePad;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (title) {
      ctx.fillStyle = '#111';
      ctx.font = `700 ${titleFont}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const maxWidth = canvas.width - padding * 2;
      const displayTitle = truncateText(ctx, title, maxWidth);
      ctx.fillText(displayTitle, canvas.width / 2, titlePad / 2);
    }

    ctx.drawImage(image, 0, titlePad);

    if (watermark) {
      ctx.fillStyle = 'rgba(17, 17, 17, 0.6)';
      ctx.font = `600 ${watermarkFont}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(watermark, canvas.width - padding, titlePad + image.height - padding);
    }

    const finalUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = finalUrl;
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  image.src = dataUrl;
};

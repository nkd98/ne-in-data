'use client';

import type { Block } from '@/lib/types';
import { IntroBlock } from './IntroBlock';
import { HeadingBlock } from './HeadingBlock';
import { ParagraphBlock } from './ParagraphBlock';
import { ChartBlock } from './ChartBlock';
import { TableBlock } from './TableBlock';
import { CalloutBlock } from './CalloutBlock';
import { ContentBlock } from './ContentBlock';

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'intro':
            return <IntroBlock key={index} content={block.content} />;
          case 'h2':
          case 'h3':
            return <HeadingBlock key={index} type={block.type} content={block.content} />;
          case 'p':
             return <ParagraphBlock key={index} content={block.content} />;
          case 'chart':
            return <ChartBlock key={index} visualId={block.visualId} />;
          case 'table':
            return <TableBlock key={index} visualId={block.visualId} />;
          case 'callout':
            return <CalloutBlock key={index} content={block.content} />;
          case 'methods':
            return <ContentBlock key={index} title="Methodology" content={block.content} />;
          case 'sources':
            return <ContentBlock key={index} title="Data Sources" content={block.content} />;
          default:
            return null;
        }
      })}
    </>
  );
}

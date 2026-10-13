import React from 'react';

/**
 * Parses inline markdown:
 * - **bold** or __bold__
 * - `code`
 * - [text](url)
 * - *italic* or _italic_
 */
export function renderInlineMarkdown(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  // Regex matching: **bold**, __bold__, `code`, [text](url), *italic*
  const pattern = /(\*\*(.*?)\*\*|__(.*?)__|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*([^*]+)\*)/;

  while (remaining) {
    const match = remaining.match(pattern);
    if (!match || match.index === undefined) {
      tokens.push(remaining);
      break;
    }

    if (match.index > 0) {
      tokens.push(remaining.substring(0, match.index));
    }

    const fullMatch = match[0];
    if (fullMatch.startsWith('**') || fullMatch.startsWith('__')) {
      const boldText = match[2] || match[3];
      tokens.push(
        <strong key={keyIdx++} className="font-extrabold text-[#111827]">
          {boldText}
        </strong>
      );
    } else if (fullMatch.startsWith('`')) {
      const codeText = match[4];
      tokens.push(
        <code
          key={keyIdx++}
          className="bg-[#f0ece4] text-[#166534] px-1.5 py-0.5 rounded text-[12px] font-mono border border-[#e2dcce]"
        >
          {codeText}
        </code>
      );
    } else if (fullMatch.startsWith('[')) {
      const linkText = match[5];
      const linkUrl = match[6];
      tokens.push(
        <a
          key={keyIdx++}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#006a4e] hover:text-[#166534] font-bold underline transition-colors"
        >
          {linkText}
        </a>
      );
    } else if (fullMatch.startsWith('*')) {
      const italicText = match[7];
      tokens.push(
        <em key={keyIdx++} className="italic text-[#374151]">
          {italicText}
        </em>
      );
    }

    remaining = remaining.substring(match.index + fullMatch.length);
  }

  return tokens;
}

interface MarkdownContentProps {
  content: string;
}

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'hr' }
  | { type: 'blockquote'; text: string }
  | {
      type: 'ordered-list';
      items: Array<{
        num: string;
        text: string;
        subItems: string[];
      }>;
    }
  | {
      type: 'unordered-list';
      items: Array<{
        text: string;
        subItems: string[];
      }>;
    }
  | { type: 'paragraph'; text: string };

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const blocks: Block[] = [];

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        blocks.push({
          type: 'heading',
          level: match[1].length,
          text: match[2]
        });
        i++;
        continue;
      }
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({
        type: 'blockquote',
        text: quoteLines.join(' ')
      });
      continue;
    }

    // Ordered List (e.g. "1. ", "2. ", "१. ", "२. ")
    const orderedMatch = trimmed.match(/^(\d+|[१२३४५६७८९०]+)\.\s+(.*)$/);
    if (orderedMatch) {
      const listItems: Array<{ num: string; text: string; subItems: string[] }> = [];

      while (i < lines.length) {
        const currentTrim = lines[i].trim();
        const curMatch = currentTrim.match(/^(\d+|[१२३४५६७८९०]+)\.\s+(.*)$/);

        if (curMatch) {
          const item = {
            num: curMatch[1],
            text: curMatch[2],
            subItems: [] as string[]
          };

          i++;
          // Collect indented sub-bullets or lines belonging to this item
          while (i < lines.length) {
            const nextRaw = lines[i];
            const nextTrim = nextRaw.trim();

            if (!nextTrim) {
              i++;
              break;
            }

            // Check if next line is a new ordered item or heading or hr
            if (
              nextTrim.match(/^(\d+|[१२३४५६७८९०]+)\.\s+/) ||
              nextTrim.startsWith('#') ||
              nextTrim === '---'
            ) {
              break;
            }

            // If it's a bullet under this item
            if (nextTrim.startsWith('- ') || nextTrim.startsWith('* ') || nextTrim.startsWith('• ')) {
              item.subItems.push(nextTrim.replace(/^[-*•]\s+/, ''));
            } else if (nextRaw.startsWith('   ') || nextRaw.startsWith('\t')) {
              item.subItems.push(nextTrim.replace(/^[-*•]\s+/, ''));
            } else {
              // Append to item text
              item.text += ' ' + nextTrim;
            }
            i++;
          }

          listItems.push(item);
        } else {
          break;
        }
      }

      blocks.push({
        type: 'ordered-list',
        items: listItems
      });
      continue;
    }

    // Unordered List (e.g. "- ", "* ", "• ")
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      const listItems: Array<{ text: string; subItems: string[] }> = [];

      while (i < lines.length) {
        const curTrim = lines[i].trim();
        if (curTrim.startsWith('- ') || curTrim.startsWith('* ') || curTrim.startsWith('• ')) {
          const item = {
            text: curTrim.replace(/^[-*•]\s+/, ''),
            subItems: [] as string[]
          };
          i++;

          // Collect indented sub-items
          while (i < lines.length) {
            const subRaw = lines[i];
            const subTrim = subRaw.trim();
            if (!subTrim) {
              i++;
              break;
            }
            if (
              subTrim.startsWith('- ') ||
              subTrim.startsWith('* ') ||
              subTrim.startsWith('• ') ||
              subTrim.match(/^\d+\.\s+/) ||
              subTrim.startsWith('#') ||
              subTrim === '---'
            ) {
              break;
            }
            if (subRaw.startsWith('   ') || subRaw.startsWith('\t')) {
              item.subItems.push(subTrim.replace(/^[-*•]\s+/, ''));
            } else {
              item.text += ' ' + subTrim;
            }
            i++;
          }
          listItems.push(item);
        } else {
          break;
        }
      }

      blocks.push({
        type: 'unordered-list',
        items: listItems
      });
      continue;
    }

    // Standard Paragraph
    const paraLines: string[] = [];
    while (i < lines.length) {
      const pLine = lines[i].trim();
      if (!pLine) {
        i++;
        break;
      }
      if (
        pLine.startsWith('#') ||
        pLine.startsWith('>') ||
        pLine === '---' ||
        pLine.match(/^(\d+|[१२३४५६७८९०]+)\.\s+/) ||
        pLine.startsWith('- ') ||
        pLine.startsWith('* ')
      ) {
        break;
      }
      paraLines.push(pLine);
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: paraLines.join(' ')
      });
    }
  }

  return (
    <div className="space-y-5 text-[#2c332e] leading-relaxed">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading': {
            if (block.level === 1 || block.level === 2) {
              return (
                <h2
                  key={idx}
                  className="font-heading font-extrabold text-[20px] sm:text-[24px] text-[#166534] pt-6 pb-2 border-b border-[#e8e2d9] flex items-center gap-2.5 tracking-tight"
                >
                  <span className="w-2 h-7 bg-[#006a4e] rounded-full inline-block shrink-0"></span>
                  <span>{renderInlineMarkdown(block.text)}</span>
                </h2>
              );
            }
            if (block.level === 3) {
              return (
                <h3
                  key={idx}
                  className="font-heading font-extrabold text-[17px] sm:text-[19px] text-[#166534] pt-4 pb-1 flex items-center gap-2"
                >
                  <span className="w-1.5 h-5 bg-[#c2410c] rounded-full inline-block shrink-0"></span>
                  <span>{renderInlineMarkdown(block.text)}</span>
                </h3>
              );
            }
            return (
              <h4
                key={idx}
                className="font-heading font-bold text-[15px] sm:text-[16px] text-[#166534] pt-2"
              >
                {renderInlineMarkdown(block.text)}
              </h4>
            );
          }

          case 'hr':
            return <hr key={idx} className="my-6 border-t-2 border-[#ece5da]" />;

          case 'blockquote':
            return (
              <div
                key={idx}
                className="bg-gradient-to-r from-[#fef9ee] to-[#fdf4e9] border-l-4 border-[#c2410c] p-4 sm:p-5 rounded-r-2xl text-[13px] sm:text-[14px] text-[#7a2b00] my-4 leading-relaxed font-semibold shadow-xs flex items-start gap-3"
              >
                <span className="material-symbols-outlined text-[#c2410c] text-[22px] shrink-0 mt-0.5">
                  info
                </span>
                <div className="flex-1">{renderInlineMarkdown(block.text)}</div>
              </div>
            );

          case 'ordered-list':
            return (
              <div key={idx} className="space-y-3 my-3">
                {block.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="p-3.5 sm:p-4 rounded-xl bg-[#fdfbf7] border border-[#e8e2d9] hover:border-[#052e16] transition-all flex items-start gap-3.5 shadow-2xs"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#166534] text-[#bbf7d0] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                      {item.num}
                    </div>
                    <div className="flex-1 space-y-1.5 text-xs sm:text-[13.5px]">
                      <div className="font-medium text-[#1f2937] leading-relaxed">
                        {renderInlineMarkdown(item.text)}
                      </div>
                      {item.subItems.length > 0 && (
                        <ul className="mt-2 pl-2 space-y-1.5 border-l-2 border-[#006a4e]/20 text-[#4b5563]">
                          {item.subItems.map((sub, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-2 pl-2 text-xs">
                              <span className="material-symbols-outlined text-[#006a4e] text-[15px] shrink-0 mt-0.5">
                                arrow_right
                              </span>
                              <span>{renderInlineMarkdown(sub)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );

          case 'unordered-list':
            return (
              <ul key={idx} className="space-y-2.5 my-3 pl-1">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-2.5 text-xs sm:text-[13.5px] leading-relaxed text-[#374151]"
                  >
                    <span className="material-symbols-outlined text-[#006a4e] text-[17px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <div className="flex-1">
                      <span>{renderInlineMarkdown(item.text)}</span>
                      {item.subItems.length > 0 && (
                        <ul className="mt-1.5 pl-3 space-y-1 text-xs text-[#555]">
                          {item.subItems.map((sub, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-1.5">
                              <span className="text-[#006a4e] font-bold">•</span>
                              <span>{renderInlineMarkdown(sub)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            );

          case 'paragraph':
            return (
              <p
                key={idx}
                className="text-xs sm:text-[14px] leading-relaxed text-[#374151] font-normal"
              >
                {renderInlineMarkdown(block.text)}
              </p>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

import React from 'react';

// SOLID Principle: Single Responsibility - Each formatter handles one type of content
class TextFormatterParsers {
  
  // Bold text parser: **text** -> <strong>text</strong>
  static parseBold(text, key = 0) {
    const match = text.match(/\*\*(.*?)\*\*/);
    if (!match) return null;
    
    return {
      beforeMatch: text.substring(0, match.index),
      element: <strong key={key} className="font-semibold text-gray-800">{match[1]}</strong>,
      afterMatch: text.substring(match.index + match[0].length),
      matchLength: match[0].length
    };
  }

  // Email link parser: [text](mailto:email) -> <a href="mailto:email">text</a>
  static parseEmailLink(text, key = 0) {
    const match = text.match(/\[([^\]]+)\]\(mailto:([^)]+)\)/);
    if (!match) return null;
    
    return {
      beforeMatch: text.substring(0, match.index),
      element: (
        <a 
          key={key} 
          href={`mailto:${match[2]}`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {match[1]}
        </a>
      ),
      afterMatch: text.substring(match.index + match[0].length),
      matchLength: match[0].length
    };
  }

  // Regular link parser: [text](url) -> <a href="url">text</a>
  static parseRegularLink(text, key = 0) {
    const match = text.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (!match) return null;
    
    return {
      beforeMatch: text.substring(0, match.index),
      element: (
        <a 
          key={key} 
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {match[1]}
        </a>
      ),
      afterMatch: text.substring(match.index + match[0].length),
      matchLength: match[0].length
    };
  }

  // Table detector: checks if text contains markdown table
  static isTable(text) {
    return /\|.*\|/.test(text);
  }

  // Table parser: converts markdown table to HTML table
  static parseMarkdownTable(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const tableLines = lines.filter(line => line.includes('|'));
    
    if (tableLines.length < 2) {
      return <span>{text}</span>;
    }

    // Parse header
    const headerCells = tableLines[0]
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell);

    // Skip separator line and get data rows
    const dataRows = tableLines.slice(1).filter(line => !line.match(/^[\s\|\-:]+$/));
    const rows = dataRows.map(line => 
      line.split('|')
        .map(cell => cell.trim())
        .filter(cell => cell)
    );

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-50">
              {headerCells.map((header, index) => (
                <th 
                  key={index}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-300"
                >
                  {TextProcessor.processInlineFormatting(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex}
                    className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200"
                  >
                    {TextProcessor.processInlineFormatting(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

// SOLID Principle: Single Responsibility - Handles text processing logic
class TextProcessor {
  
  // Registry of formatting parsers (Open/Closed Principle - easy to extend)
  static formatters = [
    TextFormatterParsers.parseBold,
    TextFormatterParsers.parseEmailLink,
    TextFormatterParsers.parseRegularLink
  ];

  // Process inline formatting (bold, links, etc.)
  static processInlineFormatting(text) {
    if (!text || typeof text !== 'string') return text;
    
    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      let foundMatch = false;

      // Try each formatter until one matches
      for (const formatter of this.formatters) {
        const result = formatter(remaining, key++);
        
        if (result) {
          // Add text before match
          if (result.beforeMatch) {
            parts.push(<span key={key++}>{result.beforeMatch}</span>);
          }
          
          // Add formatted element
          parts.push(result.element);
          
          // Continue with remaining text
          remaining = result.afterMatch;
          foundMatch = true;
          break;
        }
      }

      // No formatter matched, add remaining text and break
      if (!foundMatch) {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }

    return parts;
  }

  // Process mixed content (text + tables)
  static processMixedContent(text) {
    const lines = text.split('\n');
    const content = [];
    let currentTextBlock = [];
    let currentTableBlock = [];
    let inTable = false;
    let key = 0;

    lines.forEach(line => {
      const isTableLine = line.includes('|') && line.trim();

      if (isTableLine) {
        // Start or continue table
        if (!inTable && currentTextBlock.length > 0) {
          // Save previous text block
          const textContent = currentTextBlock.join('\n').trim();
          if (textContent) {
            content.push(
              <div key={key++} className="prose prose-sm">
                {this.processInlineFormatting(textContent)}
              </div>
            );
          }
          currentTextBlock = [];
        }
        inTable = true;
        currentTableBlock.push(line);
      } else {
        // End table if we were in one
        if (inTable && currentTableBlock.length > 0) {
          content.push(
            <div key={key++}>
              {TextFormatterParsers.parseMarkdownTable(currentTableBlock.join('\n'))}
            </div>
          );
          currentTableBlock = [];
          inTable = false;
        }
        // Add to text block
        if (line.trim() || currentTextBlock.length > 0) {
          currentTextBlock.push(line);
        }
      }
    });

    // Handle remaining content
    if (currentTableBlock.length > 0) {
      content.push(
        <div key={key++}>
          {TextFormatterParsers.parseMarkdownTable(currentTableBlock.join('\n'))}
        </div>
      );
    }
    if (currentTextBlock.length > 0) {
      const textContent = currentTextBlock.join('\n').trim();
      if (textContent) {
        content.push(
          <div key={key++} className="prose prose-sm">
            {this.processInlineFormatting(textContent)}
          </div>
        );
      }
    }

    return content;
  }
}

// SOLID Principle: Single Responsibility - Main component handles rendering logic
class TextFormatterRenderer {
  
  // Process text sections separated by ***
  static processSections(text) {
    const sections = text.split('***').filter(section => section.trim());
    
    return sections.map((section, sectionIndex) => {
      const trimmedSection = section.trim();
      
      // Check if section contains a table
      if (TextFormatterParsers.isTable(trimmedSection)) {
        // Handle mixed content (text + table)
        const mixedContent = TextProcessor.processMixedContent(trimmedSection);
        return (
          <div 
            key={sectionIndex} 
            className="mb-3 p-3 bg-blue-50 rounded-lg border-l-3 border-blue-500 space-y-3"
          >
            {mixedContent}
          </div>
        );
      }

      // Process regular formatted section
      const formattedSection = TextProcessor.processInlineFormatting(trimmedSection);
      
      return (
        <div 
          key={sectionIndex} 
          className="mb-3 p-3 bg-blue-50 rounded-lg border-l-3 border-blue-500"
        >
          {formattedSection}
        </div>
      );
    });
  }
}

// SOLID Principle: Main component follows Single Responsibility (rendering)
const TextFormatter = ({ text, className = "" }) => {
  if (!text) return null;

  return (
    <div className={`formatted-text ${className}`}>
      {TextFormatterRenderer.processSections(text)}
    </div>
  );
};

// Usage example component
const ChatMessage = ({ message }) => {
  return (
    <div className="message">
      <TextFormatter 
        text={message.content} 
        className="leading-relaxed"
      />
    </div>
  );
};

export default TextFormatter;
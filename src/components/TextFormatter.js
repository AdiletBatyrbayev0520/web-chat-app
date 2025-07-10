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

  // Auto URL parser: detects plain URLs and converts them to links
  static parseAutoURL(text, key = 0) {
    // More precise regex that matches complete URLs
    // Matches: protocol://domain, www.domain, or just domain with common TLDs
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.(?:com|kz|ru|org|net|io|dev|edu|gov|co|uk|de|fr|it|es|jp|cn|in|br|mx|au|ca|nl|se|no|fi|dk|pl|cz|sk|hu|ro|bg|gr|tr|ua|by|kg|uz|tm|tj|ge|am|az|mn|vn|th|id|my|sg|ph|kr|tw|hk|mo|il|sa|ae|qa|kw|om|jo|lb|sy|iq|ir|af|pk|bd|lk|np|bt|mv|ps|ye|ly|eg|ma|tn|dz|et|ke|ng|za|gh|ug|tz|zw|zm|mw|mz|bw|na|sz|ls|rw|bi|dj|so|er|sd|ss|sn|gm|sl|lr|ci|ml|bf|ne|tg|bj|gn|gw|mr|eh|st|gq|ga|cg|cd|cf|cm|td|ao|cv|km|sc|mu|mg|re|yt|tf|aq|sh|pm|gl|fo|is|sj|ax|eu|su|info|biz|name|mobi|travel|jobs|museum|coop|aero|xxx|idv|how|wiki|tech|online|site|club|app|blog|shop|pro|tel|asia|post)(?::[0-9]{1,5})?(?:\/[^\s<>"{}|\\^`\[\]]*)?/i;
    const match = text.match(urlRegex);
    if (!match) return null;
    
    let url = match[0];
    // Add http:// if URL doesn't start with http:// or https://
    const href = url.match(/^https?:\/\//) ? url : `http://${url}`;
    
    return {
      beforeMatch: text.substring(0, match.index),
      element: (
        <a 
          key={key} 
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline break-all"
        >
          {url}
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

  // Numbered list detector: checks if text contains numbered lists
  static hasNumberedList(text) {
    // Updated to handle bold markers within numbered lists
    return /^\s*\d+\.\s+|^\s*\d+\.\s*\*\*\d+\.\*\*/m.test(text);
  }

  // Numbered list parser: converts numbered lists to formatted list
  static parseNumberedList(text) {
    const lines = text.split('\n');
    const listItems = [];
    let currentItem = null;
    let currentNumber = null;
    
    lines.forEach((line) => {
      // Handle various numbered list formats
      let match = null;
      let content = '';
      
      // Pattern 1: "1. **1.**Content" (duplicated with bold)
      const duplicateMatch = line.match(/^\s*(\d+)\.\s*\*\*\d+\.\*\*\s*(.*)$/);
      if (duplicateMatch) {
        match = duplicateMatch;
        content = duplicateMatch[2];
      } else {
        // Pattern 2: "1. Content" (standard)
        const standardMatch = line.match(/^\s*(\d+)\.\s+(.*)$/);
        if (standardMatch) {
          match = standardMatch;
          content = standardMatch[2];
        }
      }
      
      if (match) {
        // Save previous item if exists
        if (currentItem !== null) {
          listItems.push({
            number: currentNumber,
            content: currentItem.trim()
          });
        }
        // Start new item
        currentNumber = match[1];
        currentItem = content;
      } else if (currentItem !== null && line.trim()) {
        // Continue current item (multi-line support)
        // Check if line starts with a dash (sub-item)
        if (line.trim().startsWith('-')) {
          currentItem += '\n' + line.trim();
        } else {
          currentItem += ' ' + line.trim();
        }
      } else if (!line.trim() && currentItem !== null) {
        // Empty line ends current item
        listItems.push({
          number: currentNumber,
          content: currentItem.trim()
        });
        currentItem = null;
        currentNumber = null;
      }
    });
    
    // Don't forget last item
    if (currentItem !== null) {
      listItems.push({
        number: currentNumber,
        content: currentItem.trim()
      });
    }
    
    if (listItems.length === 0) return null;
    
    return (
      <ol className="space-y-2 ml-4">
        {listItems.map((item, index) => (
          <li key={index} className="flex">
            <span className="font-semibold text-gray-700 mr-2 min-w-[2rem]">{item.number}.</span>
            <div className="flex-1">
              {item.content.includes('\n-') ? 
                this.formatListItemWithSubItems(item.content) : 
                TextProcessor.processInlineFormatting(item.content)
              }
            </div>
          </li>
        ))}
      </ol>
    );
  }

  // Helper to format list items that contain sub-items
  static formatListItemWithSubItems(content) {
    const parts = content.split('\n');
    const mainContent = parts[0];
    const subItems = parts.slice(1).filter(line => line.trim().startsWith('-'));
    
    return (
      <>
        {TextProcessor.processInlineFormatting(mainContent)}
        {subItems.length > 0 && (
          <ul className="mt-1 ml-4 space-y-1">
            {subItems.map((subItem, index) => (
              <li key={index} className="text-sm">
                {TextProcessor.processInlineFormatting(subItem.replace(/^-\s*/, ''))}
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }
}

// SOLID Principle: Single Responsibility - Handles text processing logic
class TextProcessor {
  
  // Registry of formatting parsers (Open/Closed Principle - easy to extend)
  // Order matters: more specific patterns should come before general ones
  static formatters = [
    TextFormatterParsers.parseEmailLink,    // [text](mailto:email) - most specific
    TextFormatterParsers.parseRegularLink,  // [text](url) - specific markdown
    TextFormatterParsers.parseBold,         // **text** - inline formatting
    TextFormatterParsers.parseAutoURL       // plain URLs - most general
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

  // Process mixed content (text + tables + lists)
  static processMixedContent(text) {
    const lines = text.split('\n');
    const content = [];
    let currentTextBlock = [];
    let currentTableBlock = [];
    let currentListBlock = [];
    let inTable = false;
    let inList = false;
    let key = 0;

    lines.forEach((line, index) => {
      const isTableLine = line.includes('|') && line.trim();
      const isListLine = /^\s*\d+\.\s+|^\s*\d+\.\s*\*\*\d+\.\*\*/.test(line);
      const isEmptyLine = !line.trim();

      // Handle table lines
      if (isTableLine) {
        // End list if we were in one
        if (inList && currentListBlock.length > 0) {
          content.push(
            <div key={key++}>
              {TextFormatterParsers.parseNumberedList(currentListBlock.join('\n'))}
            </div>
          );
          currentListBlock = [];
          inList = false;
        }
        // Save text block if exists
        if (!inTable && currentTextBlock.length > 0) {
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
      }
      // Handle list lines
      else if (isListLine || (inList && !isEmptyLine)) {
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
        // Save text block if exists
        if (!inList && currentTextBlock.length > 0) {
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
        inList = true;
        currentListBlock.push(line);
      }
      // Handle regular text
      else {
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
        // End list if we were in one (and this is empty line or last line)
        if (inList && currentListBlock.length > 0 && (isEmptyLine || index === lines.length - 1)) {
          content.push(
            <div key={key++}>
              {TextFormatterParsers.parseNumberedList(currentListBlock.join('\n'))}
            </div>
          );
          currentListBlock = [];
          inList = false;
        }
        // Add to text block
        if (!isEmptyLine || currentTextBlock.length > 0) {
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
    if (currentListBlock.length > 0) {
      content.push(
        <div key={key++}>
          {TextFormatterParsers.parseNumberedList(currentListBlock.join('\n'))}
        </div>
      );
    }
    if (currentTextBlock.length > 0) {
      const textContent = currentTextBlock.join('\n').trim();
      if (textContent && !TextFormatterParsers.hasNumberedList(textContent)) {
        content.push(
          <div key={key++} className="prose prose-sm">
            {this.processInlineFormatting(textContent)}
          </div>
        );
      } else if (TextFormatterParsers.hasNumberedList(textContent)) {
        content.push(
          <div key={key++}>
            {TextFormatterParsers.parseNumberedList(textContent)}
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
      
      // Check if section contains special content (table or list)
      if (TextFormatterParsers.isTable(trimmedSection) || TextFormatterParsers.hasNumberedList(trimmedSection)) {
        // Handle mixed content
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

// Example with all features
const ExampleUsage = () => {
  const sampleText = `
Check out our website at https://example.com for more info!
***
Here's what we offer:
1. Professional web development with modern frameworks
2. Mobile app development for iOS and Android platforms
3. Cloud infrastructure setup and DevOps consulting
***
Visit www.ourcompany.com or contact us at **support@company.com**
***
Our pricing table:
| Service | Basic | Pro | Enterprise |
|---------|-------|-----|------------|
| Web Dev | $1000 | $2500 | Custom |
| Mobile | $1500 | $3500 | Custom |
| Cloud | $500 | $1200 | Custom |
***
Learn more at [our documentation](https://docs.example.com) or [email us](mailto:info@example.com)!
***
🌐 Official Resources:
1. **Main website:** https://sdu.edu.kz
2. **Specialized portals:**
   - Education platform: pms.sdu.edu.kz
   - Repository: repository.sdu.edu.kz
   - Helpdesk: helpdesk.sdu.edu.kz
3. **Social Media:**
   - Instagram: @sdukz
   - LinkedIn: SDU University
`;

  return <TextFormatter text={sampleText} />;
};

export default TextFormatter;
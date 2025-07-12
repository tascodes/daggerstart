import React from "react";

/**
 * Parses simple markdown-style formatting in text:
 * - **bold text** becomes <strong>bold text</strong>
 * - \n becomes line breaks
 */
export const parseMarkdownText = (text: string): React.ReactNode => {
  // First replace literal \n with actual line breaks
  const textWithBreaks = text.replace(/\\n/g, "\n");

  // Split by line breaks
  const lines = textWithBreaks.split("\n");

  return lines.map((line, lineIndex) => {
    // Parse bold text within each line
    const parts = line.split(/(\*\*.*?\*\*)/);

    const parsedLine = parts.map((part, partIndex) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Remove the ** markers and make bold
        const boldText = part.slice(2, -2);
        return (
          <strong
            key={`${lineIndex}-${partIndex}`}
            className="font-bold text-white"
          >
            {boldText}
          </strong>
        );
      }
      return part;
    });

    // Add line break after each line except the last one
    return (
      <React.Fragment key={lineIndex}>
        {parsedLine}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};

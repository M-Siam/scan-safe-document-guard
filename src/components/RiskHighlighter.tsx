
import { useState } from "react";
import { RiskMatch } from "@/utils/regexPatterns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RiskHighlighterProps {
  text: string;
  matches: RiskMatch[];
}

export function RiskHighlighter({ text, matches }: RiskHighlighterProps) {
  const [selectedMatch, setSelectedMatch] = useState<RiskMatch | null>(null);
  
  // If no text or matches, return empty
  if (!text) return null;
  
  // Function to highlight text with detected risks
  const renderHighlightedText = () => {
    if (matches.length === 0) {
      return <p className="whitespace-pre-wrap break-words">{text}</p>;
    }
    
    // Sort matches by index to process in order
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);
    const segments = [];
    let lastIndex = 0;
    
    // Process each match
    for (const match of sortedMatches) {
      // Add text before the match
      if (match.index > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }
      
      // Add the highlighted match
      const highlightClass = `highlight-${match.severity}`;
      const isSelected = selectedMatch === match;
      
      segments.push(
        <TooltipProvider key={`match-${match.index}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span 
                className={`${highlightClass} cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
                onMouseEnter={() => setSelectedMatch(match)}
                onMouseLeave={() => setSelectedMatch(null)}
              >
                {match.match}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{match.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      
      lastIndex = match.index + match.length;
    }
    
    // Add remaining text after the last match
    if (lastIndex < text.length) {
      segments.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex)}
        </span>
      );
    }
    
    return <div className="whitespace-pre-wrap break-words">{segments}</div>;
  };

  return (
    <div className="font-mono text-sm leading-relaxed animate-fade-in">
      {renderHighlightedText()}
    </div>
  );
}

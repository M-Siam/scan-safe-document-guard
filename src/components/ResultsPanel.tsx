
import { Separator } from "@/components/ui/separator";
import { RiskMatch } from "@/utils/regexPatterns";
import { DocumentScanner } from "./DocumentScanner";

interface DocumentResult {
  file: File;
  text: string;
  metadata: any;
  matches: RiskMatch[];
}

interface ResultsPanelProps {
  results: DocumentResult[];
  isLoading: boolean;
}

export function ResultsPanel({ results, isLoading }: ResultsPanelProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <div className="h-8 w-8 border-t-4 border-primary animate-spin rounded-full" />
          </div>
          <h2 className="text-xl font-medium">Analyzing document...</h2>
          <p className="text-muted-foreground">
            We're scanning for privacy risks in your document. This might take a moment.
          </p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Scan Results</h2>
      
      {results.map((result, index) => (
        <div key={`${result.file.name}-${index}`}>
          <DocumentScanner
            fileName={result.file.name}
            text={result.text}
            metadata={result.metadata}
            matches={result.matches}
          />
          {index < results.length - 1 && <Separator className="my-8" />}
        </div>
      ))}
    </div>
  );
}

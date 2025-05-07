
import { useState } from "react";
import { extractTextFromFile } from "@/utils/documentUtils";
import { scanText } from "@/utils/scanUtils";
import { RiskMatch } from "@/utils/regexPatterns";
import { Header } from "@/components/Header";
import { UploadArea } from "@/components/UploadArea";
import { ResultsPanel } from "@/components/ResultsPanel";
import { Separator } from "@/components/ui/separator";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface DocumentResult {
  file: File;
  text: string;
  metadata: any;
  matches: RiskMatch[];
}

export default function Index() {
  const [results, setResults] = useState<DocumentResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  
  // Process uploaded files
  const handleFilesAccepted = async (files: File[]) => {
    setIsScanning(true);
    
    try {
      const newResults: DocumentResult[] = [];
      
      for (const file of files) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 5MB limit.`,
            variant: "destructive"
          });
          continue;
        }
        
        // Extract text from file
        const { text, metadata } = await extractTextFromFile(file);
        
        // Scan text for privacy risks
        const matches = scanText(text);
        
        // Add results
        newResults.push({
          file,
          text,
          metadata,
          matches
        });
      }
      
      setResults(newResults);
      
      if (newResults.length > 0) {
        toast({
          title: "Scan complete",
          description: `Found ${newResults.reduce((acc, curr) => acc + curr.matches.length, 0)} potential privacy risks.`
        });
      }
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        title: "Error processing files",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="py-8">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h1 className="text-3xl font-bold mb-4">
                  ScanShield
                </h1>
                <h2 className="text-xl mb-6 text-muted-foreground">
                  Smart Document Risk Checker
                </h2>
                <p className="mb-4">
                  Protect your privacy before you share documents. Instantly scan for emails, phone numbers, IDs, and hidden metadata — 100% free and offline.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Privacy-First</h3>
                      <p className="text-sm text-muted-foreground">
                        100% client-side scanning - nothing leaves your device
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <ShieldAlert className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Risk Detection</h3>
                      <p className="text-sm text-muted-foreground">
                        Identify and sanitize sensitive data before sharing
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <UploadArea onFilesAccepted={handleFilesAccepted} />
              </div>
            </div>
          </div>
        </section>
        
        {(results.length > 0 || isScanning) && (
          <>
            <Separator />
            <section className="py-8">
              <div className="container">
                <ResultsPanel results={results} isLoading={isScanning} />
              </div>
            </section>
          </>
        )}
      </main>
      
      <footer className="border-t py-6">
        <div className="container">
          <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <p>ScanShield — Smart Document Risk Checker</p>
            </div>
            <p>
              100% free and offline. Your documents never leave your device.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

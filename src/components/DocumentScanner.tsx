
import { useState } from "react";
import { RiskMatch } from "@/utils/regexPatterns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskHighlighter } from "./RiskHighlighter";
import { PrivacyScore } from "./PrivacyScore";
import { calculatePrivacyScore, sanitizeText } from "@/utils/scanUtils";
import { downloadSanitizedContent } from "@/utils/documentUtils";
import { Download, FileCheck, FileText, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DocumentScannerProps {
  fileName: string;
  text: string;
  metadata: any;
  matches: RiskMatch[];
}

export function DocumentScanner({ fileName, text, metadata, matches }: DocumentScannerProps) {
  const [activeTab, setActiveTab] = useState("original");
  const privacyScore = calculatePrivacyScore(text, matches);
  const sanitizedText = sanitizeText(text, matches);
  
  const handleDownload = (format: 'txt' | 'docx') => {
    downloadSanitizedContent(sanitizedText, fileName, format);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{fileName}</h3>
          <p className="text-sm text-muted-foreground">
            {matches.length} {matches.length === 1 ? 'risk' : 'risks'} detected
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Document Content</CardTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="original">Original</TabsTrigger>
                  <TabsTrigger value="sanitized">Sanitized</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto border rounded-md p-4">
            <TabsContent value="original" className="mt-0">
              <RiskHighlighter text={text} matches={matches} />
            </TabsContent>
            <TabsContent value="sanitized" className="mt-0">
              <div className="font-mono text-sm leading-relaxed">
                <p className="whitespace-pre-wrap break-words">{sanitizedText}</p>
              </div>
            </TabsContent>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{text.length} characters</span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDownload('txt')} 
                disabled={activeTab !== 'sanitized'}
              >
                <Download className="h-4 w-4 mr-1" />
                Save as TXT
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleDownload('docx')}
                disabled={activeTab !== 'sanitized'}
              >
                <FileCheck className="h-4 w-4 mr-1" />
                Save as DOCX
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <PrivacyScore score={privacyScore} matches={matches} />
            </CardContent>
          </Card>
          
          {Object.keys(metadata).length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle>Document Metadata</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="rounded-full bg-muted p-1 cursor-help">
                          <Info className="h-3 w-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Metadata can contain personal information about the document creator</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

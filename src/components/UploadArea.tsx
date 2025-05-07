
import { useCallback, useState } from "react";
import { Upload, File, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface UploadAreaProps {
  onFilesAccepted: (files: File[]) => void;
}

export function UploadArea({ onFilesAccepted }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    validateAndProcessFiles(files);
  }, []);
  
  // Handle file selection via input
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      validateAndProcessFiles(files);
    }
  }, []);
  
  // Validate files and pass them to parent if valid
  const validateAndProcessFiles = useCallback((files: File[]) => {
    const validFileTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    
    const validExtensions = ['pdf', 'docx', 'txt'];
    
    const invalidFiles = files.filter(file => {
      const fileType = file.type;
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      return !validFileTypes.includes(fileType) && 
             extension && !validExtensions.includes(extension);
    });
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file(s)",
        description: "Please upload only PDF, DOCX, or TXT files.",
        variant: "destructive"
      });
      return;
    }
    
    onFilesAccepted(files);
  }, [onFilesAccepted]);

  return (
    <div className="space-y-4">
      <div
        className={`drop-zone flex flex-col items-center justify-center animate-fade-in ${isDragging ? 'drop-zone-active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          className="sr-only"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={handleFileSelect}
          multiple
        />
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-lg font-medium">Drop your documents here</p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, DOCX, TXT (max 5MB each)
            </p>
          </div>
          <Button 
            onClick={() => document.getElementById('file-upload')?.click()}
            className="ripple-button"
          >
            Browse files
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2">
          <File className="h-5 w-5 text-primary" />
          <h3 className="font-medium">PDF Documents</h3>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-medium">DOCX Files</h3>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-medium">TXT Files</h3>
        </div>
      </div>
    </div>
  );
}

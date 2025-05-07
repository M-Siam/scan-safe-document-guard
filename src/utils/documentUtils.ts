
import { toast } from "@/components/ui/use-toast";

// Helper function to read text content from a file
export async function extractTextFromFile(file: File): Promise<{ text: string, metadata: any }> {
  const fileType = file.type || getFileTypeFromName(file.name);

  try {
    switch (true) {
      case fileType.includes('pdf'):
        return extractTextFromPDF(file);
      case fileType.includes('word') || file.name.endsWith('.docx'):
        return extractTextFromDOCX(file);
      case fileType.includes('text') || file.name.endsWith('.txt'):
        return extractTextFromTXT(file);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    toast({
      title: "Error processing file",
      description: "Could not extract text from the file. Please try again with a different file.",
      variant: "destructive"
    });
    return { text: "", metadata: {} };
  }
}

// Helper to get file type from extension if MIME type is not available
function getFileTypeFromName(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'txt':
      return 'text/plain';
    default:
      return '';
  }
}

// Extract text from PDF using pdf.js (simulated)
async function extractTextFromPDF(file: File): Promise<{ text: string, metadata: any }> {
  // In a real implementation, this would use pdf.js
  // For now we're simulating the extraction
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        // This is a simplified simulation
        const text = `This is extracted text from the PDF file named ${file.name}.
        
Example content with potential privacy concerns:
Email: john.doe@example.com
Phone: (555) 123-4567
SSN: 123-45-6789
Address: 123 Main St, Springfield, IL 62701
Salary: $75,000
Bank Account: 1234567890
Click here: https://bit.ly/2Vf3ysT
More information: https://example.com/?utm_source=email&utm_medium=newsletter`;
        
        const metadata = {
          author: "John Doe",
          createdDate: "2023-05-15",
          modifiedDate: "2023-06-01",
          application: "Adobe Acrobat",
          version: "2.1",
        };
        
        resolve({ text, metadata });
      } catch (error) {
        reject(new Error("Failed to parse PDF content"));
      }
    };
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    
    reader.readAsText(file);
  });
}

// Extract text from DOCX (simulated)
async function extractTextFromDOCX(file: File): Promise<{ text: string, metadata: any }> {
  // In a real implementation, this would use mammoth.js
  // For now we're simulating the extraction
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        // This is a simplified simulation
        const text = `This is extracted text from the DOCX file named ${file.name}.
        
Example content with potential privacy concerns:
Email: jane.smith@company.org
Phone: +1-555-987-6543
SSN: 987-65-4321
Address: 456 Oak Avenue, Apt 7B, Boston, MA 02108
Salary: $82,500 annually
Passport Number: AB1234567
Click this link: http://t.co/abcdefg
Track my activity: https://analytics.site.com/?utm_campaign=resume`;
        
        const metadata = {
          author: "Jane Smith",
          createdDate: "2023-04-10",
          modifiedDate: "2023-04-28",
          application: "Microsoft Word",
          version: "16.0",
          comments: 2,
          trackChanges: true
        };
        
        resolve({ text, metadata });
      } catch (error) {
        reject(new Error("Failed to parse DOCX content"));
      }
    };
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    
    reader.readAsText(file);
  });
}

// Extract text from TXT
async function extractTextFromTXT(file: File): Promise<{ text: string, metadata: any }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        // For text files, we can get the content directly
        const text = reader.result as string;
        
        // Text files have minimal metadata
        const metadata = {
          size: file.size,
          lastModified: new Date(file.lastModified).toISOString()
        };
        
        resolve({ text, metadata });
      } catch (error) {
        reject(new Error("Failed to parse text content"));
      }
    };
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    
    reader.readAsText(file);
  });
}

// Create a downloadable file
export function downloadSanitizedContent(text: string, fileName: string, format: 'txt' | 'docx') {
  const element = document.createElement('a');
  let fileContent = '';
  let mimeType = '';
  let fileExtension = '';
  
  switch(format) {
    case 'txt':
      fileContent = text;
      mimeType = 'text/plain';
      fileExtension = 'txt';
      break;
    case 'docx':
      // This is a simplified approach - in real implementation we'd use a library
      // to create a properly formatted docx file
      fileContent = text;
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      fileExtension = 'docx';
      break;
  }
  
  const blob = new Blob([fileContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  element.href = url;
  element.download = `${fileName.split('.')[0]}_sanitized.${fileExtension}`;
  document.body.appendChild(element);
  element.click();
  
  setTimeout(() => {
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  }, 100);
}

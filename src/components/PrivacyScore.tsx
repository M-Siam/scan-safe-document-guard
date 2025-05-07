
import { RiskMatch } from "@/utils/regexPatterns";
import { Progress } from "@/components/ui/progress";
import { getRiskLevel } from "@/utils/scanUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface PrivacyScoreProps {
  score: number;
  matches: RiskMatch[];
}

export function PrivacyScore({ score, matches }: PrivacyScoreProps) {
  const riskLevel = getRiskLevel(score);
  
  // Group matches by type
  const riskCounts = matches.reduce((acc: Record<string, number>, match) => {
    acc[match.type] = (acc[match.type] || 0) + 1;
    return acc;
  }, {});
  
  // Map risk type to display name
  const riskTypeLabels: Record<string, string> = {
    email: 'Emails',
    phone: 'Phone Numbers',
    id: 'ID/SSN Numbers',
    address: 'Addresses',
    trackingUrl: 'Tracking URLs',
    sensitiveKeyword: 'Sensitive Keywords'
  };
  
  const getScoreColor = () => {
    if (score >= 70) return 'bg-risk-low';
    if (score >= 40) return 'bg-risk-medium';
    return 'bg-risk-high';
  };
  
  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'low':
        return <ShieldCheck className="h-5 w-5 text-risk-low" />;
      case 'medium':
        return <Shield className="h-5 w-5 text-risk-medium" />;
      case 'high':
        return <ShieldAlert className="h-5 w-5 text-risk-high" />;
    }
  };
  
  const getRiskTitle = () => {
    switch (riskLevel) {
      case 'low':
        return 'Low Risk';
      case 'medium':
        return 'Medium Risk';
      case 'high':
        return 'High Risk';
    }
  };
  
  const getRiskDescription = () => {
    switch (riskLevel) {
      case 'low':
        return 'This document contains minimal privacy concerns. It\'s relatively safe to share.';
      case 'medium':
        return 'This document contains some privacy risks that should be addressed before sharing.';
      case 'high':
        return 'This document contains significant privacy risks. Strongly consider redaction before sharing.';
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Privacy Score</h3>
        <div className="flex justify-between items-center">
          <span className="font-bold text-2xl">{score}/100</span>
          <span className={`
            capitalize px-3 py-1 rounded-full text-sm font-medium
            ${riskLevel === 'low' ? 'bg-risk-low/10 text-risk-low' : ''}
            ${riskLevel === 'medium' ? 'bg-risk-medium/10 text-risk-medium' : ''}
            ${riskLevel === 'high' ? 'bg-risk-high/10 text-risk-high' : ''}
          `}>
            {riskLevel} Risk
          </span>
        </div>
        <Progress value={score} className="h-2" indicatorClassName={getScoreColor()} />
      </div>
      
      <Alert>
        <div className="flex items-start gap-3">
          {getRiskIcon()}
          <div>
            <AlertTitle>{getRiskTitle()}</AlertTitle>
            <AlertDescription>
              {getRiskDescription()}
            </AlertDescription>
          </div>
        </div>
      </Alert>
      
      <div className="space-y-2">
        <h4 className="font-medium">Risk Breakdown</h4>
        <div className="grid gap-2">
          {Object.entries(riskCounts).map(([type, count]) => (
            <div key={type} className="flex justify-between items-center text-sm">
              <span>{riskTypeLabels[type] || type}:</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
          {Object.keys(riskCounts).length === 0 && (
            <div className="text-sm text-muted-foreground">
              No risks detected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

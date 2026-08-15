export interface CredentialData {
  id: string; // Hash (32 bytes hex)
  title: string;
  courseTitle: string;
  courseId: number;
  recipientAddress: string;
  recipientName: string;
  issuedAtLedger: number;
  issuedTimestamp: number;
  averageScorePct: number;
  totalTokensEarned: number;
  signatureProof: string;
  skillsVerified: string[];
  stellarExplorerUrl: string;
  isValid: boolean;
}

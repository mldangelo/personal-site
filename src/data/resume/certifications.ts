export interface Certification {
  name: string;
  issuer: string;
  startDate: string;
  endDate: string;
}

export interface Achievement {
  description: string;
}

const certifications: Certification[] = [
  {
    name: 'SailPoint Certified IdentityIQ Engineer',
    issuer: 'SailPoint',
    startDate: '2025-06-01',
    endDate: '2027-06-01',
  },
  {
    name: 'SailPoint Certified IdentityNow Engineer',
    issuer: 'SailPoint',
    startDate: '2025-03-01',
    endDate: '2027-03-01',
  },
  {
    name: 'SailPoint Certified IdentityNow Professional',
    issuer: 'SailPoint',
    startDate: '2024-05-01',
    endDate: '2026-05-01',
  },
  {
    name: 'Okta Certified Professional',
    issuer: 'Okta',
    startDate: '2021-10-01',
    endDate: '2023-10-01',
  },
];

export const achievements: Achievement[] = [
  {
    description:
      'Reduced AWS infrastructure deployment time by 30% and increased scalability by 20%.',
  },
  {
    description:
      'Integrated IAM with more than 10 applications, reducing onboarding time by 40%.',
  },
  {
    description:
      'Reduced manual effort by 40% through PowerShell and Java provisioning and reconciliation automation.',
  },
  { description: 'Earned SailPoint Ambassador recognition.' },
];

export default certifications;

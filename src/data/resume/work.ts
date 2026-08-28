/**
 * Conforms to https://jsonresume.org/schema/
 */
export interface Position {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

const work: Position[] = [
  {
    name: 'Avancer Corp',
    position: 'Information Security Analyst',
    url: 'https://www.avancercorp.com',
    startDate: '2024-06-01',
    highlights: [
      'Designed, developed, configured, tested, deployed, and supported SailPoint IdentityIQ and Identity Security Cloud solutions across lifecycle management, provisioning, aggregation, access requests, certifications, workflows, roles, entitlements, and application integrations.',
      'Built and maintained connectors, aggregation and provisioning jobs, approval workflows, reports, SoD controls, and HR-driven joiner-mover-leaver processes.',
      'Developed IAM solutions using BeanShell, PowerShell, Java, TypeScript, SQL, REST, SOAP, SCIM, SAML, OAuth, OIDC, LDAP, and SailPoint APIs.',
      'Integrated IAM systems with more than 10 applications, reducing onboarding time by 40%, and collaborated with security, infrastructure, application, HR, vendor, and business stakeholders.',
    ],
  },
  {
    name: 'PwC',
    position: 'IAM Consultant',
    url: 'https://www.pwc.com',
    startDate: '2022-06-01',
    endDate: '2022-12-01',
    highlights: [
      'Integrated SOAP and REST web services to synchronize identity data between SailPoint and cloud business applications.',
      'Implemented joiner, mover, leaver, conversion, and leave-of-absence lifecycle scenarios for automated birthright access, provisioning, and deprovisioning.',
      'Implemented User Access Reviews, certification campaigns, SoD controls, and attribute-based policies to strengthen access governance.',
      'Supported Entra ID workflows involving users, groups, roles, enterprise applications, and hybrid identity integration patterns.',
    ],
  },
  {
    name: 'KPMG',
    position: 'Associate Consultant',
    url: 'https://kpmg.com',
    startDate: '2022-01-01',
    endDate: '2022-06-01',
    highlights: [
      'Designed advanced SailPoint workflows and event-based triggers for complex lifecycle management processes.',
      'Defined RBAC and least-privilege strategies across SailPoint IdentityIQ and Identity Security Cloud implementations.',
      'Supported non-human identities including service accounts, connector accounts, API keys, tokens, workloads, and machine-to-machine access.',
      'Implemented AWS Lambda and Azure Functions for custom IAM functionality and automated provisioning and reconciliation, reducing manual effort by 40%.',
    ],
  },
  {
    name: 'Cotelligent',
    position: 'Consultant Delivery',
    url: 'https://www.cotelligent.com',
    startDate: '2020-03-01',
    endDate: '2021-12-01',
    highlights: [
      'Implemented SAML, OAuth, and LDAP identity integrations and built JAX-RS microservices using SailPoint APIs.',
      'Managed lifecycle events and joiner-mover-leaver provisioning and deprovisioning processes.',
      'Onboarded JDBC, delimited-file, and Okta applications with customization, creation, and correlation rules.',
      'Created entitlement, provisioning transaction, and custom-object reports using filters, HQL, Java, and the SailPoint SDK.',
      'Created IAM architecture notes, standards, runbooks, workflow documentation, operational handoff materials, and audit evidence.',
      'Recognized as a SailPoint Ambassador for technical guidance and developer-community contributions.',
    ],
  },
];

export default work;

export interface Skill {
  title: string;
  competency: number;
  category: string[];
}

export interface Category {
  name: string;
  color: string;
}

const skillDefinitions: Array<[string, number, string]> = [
  ['SailPoint ISC', 5, 'IAM'],
  ['IdentityIQ', 5, 'IAM'],
  ['NERM', 4, 'IAM'],
  ['Okta', 4, 'IAM'],
  ['Active Directory', 4, 'IAM'],
  ['LDAP', 4, 'IAM'],
  ['Entra ID', 4, 'IAM'],
  ['Java', 5, 'Languages & Frameworks'],
  ['Spring Boot', 4, 'Languages & Frameworks'],
  ['JAX-RS', 4, 'Languages & Frameworks'],
  ['Python', 4, 'Languages & Frameworks'],
  ['JavaScript', 4, 'Languages & Frameworks'],
  ['TypeScript', 4, 'Languages & Frameworks'],
  ['SQL', 4, 'Languages & Frameworks'],
  ['PowerShell', 5, 'Languages & Frameworks'],
  ['Shell', 4, 'Languages & Frameworks'],
  ['BeanShell', 4, 'Languages & Frameworks'],
  ['AWS Lambda', 4, 'Languages & Frameworks'],
  ['Azure Functions', 4, 'Languages & Frameworks'],
  ['Oracle / MySQL / DB2 / MongoDB', 4, 'Tools & Infrastructure'],
  ['Tomcat / JBoss / WebLogic', 4, 'Tools & Infrastructure'],
  ['Jenkins / Ansible / Git', 4, 'Tools & Infrastructure'],
  ['Splunk / Jira / Confluence', 4, 'Tools & Infrastructure'],
  ['Lucidchart / Visio / PuTTY / WinSCP', 4, 'Tools & Infrastructure'],
  ['AWS / Azure / GCP', 4, 'Tools & Infrastructure'],
];

const skills: Skill[] = skillDefinitions.map(
  ([title, competency, category]) => ({
    title,
    competency,
    category: [category],
  }),
);

function buildCategories(skillsList: Skill[]): Category[] {
  const uniqueCategories = Array.from(
    new Set(skillsList.flatMap(({ category }) => category)),
  ).sort();

  return uniqueCategories.map((name) => ({
    name,
    color: 'var(--color-accent)',
  }));
}

const categories: Category[] = buildCategories(skills);

export { categories, skills };

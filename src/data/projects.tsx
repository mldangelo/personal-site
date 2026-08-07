export interface IProject {
  title: string;
  subtitle?: string;
  date: string;
  desc?: string;
  link?: string;
  pdf?: string;
  youtube?: string;
}

const data: IProject[] = [
  {
    title: 'Testcontainers Live',
    date: '2023-08-09',
    youtube: 'T_DKV7XCNgk'
  },
  {
    title: 'A System for Automated Facial Expression Recognition',
    date: '2019-12-01',
    pdf: 'papers/Automated-Facial-Exp.pdf'
  },
  {
    title:
      'A Review of Techniques Related to Automated Facial Expression Recognition',
    date: '2019-03-01',
    pdf: 'papers/LitReview.pdf'
  },
  {
    title: 'Machine Learning Feature Selection and Analysis',
    date: '2018-12-01',
    pdf: 'papers/MachineLearningFeatureSelectionAndAnalysis-Dase.pdf'
  }
];

export default data;

// TODO Add a couple lines about each project

export interface IProject {
  title: string;
  subtitle: string;
  image: string;
  date: string;
  desc: string;
  link?: string;
  pdf?: string;
}

const data: IProject[] = [
  {
    title: 'A System for Automated Facial Expression Recognition',
    subtitle: 'A system for automated facial expression recognition',
    image: '',
    date: '2019-12-01',
    desc: '',
    pdf: 'papers/Automated-Facial-Exp.pdf',
  },
  {
    title:
      'A Review of Techniques Related to Automated Facial Expression Recognition',
    subtitle: 'A system for automated facial expression recognition',
    image: '',
    date: '2019-03-01',
    desc: '',
    pdf: 'papers/LitReview.pdf',
  },
  {
    title: 'Machine Learning Feature Selection and Analysis',
    subtitle: 'A system for automated facial expression recognition',
    image: '',
    date: '2018-12-01',
    desc: '',
    pdf: 'papers/MachineLearningFeatureSelectionAndAnalysis-Dase.pdf',
  },
];

export default data;

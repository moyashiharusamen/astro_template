export const SITE = {
  urlOrigin: 'https://template.com',
  title: 'Default Title',
  description: 'Default Description',
  ogImage: 'default_og.jpg',
  rootPath: '/',
};

export const PAGELIST = [
  {
    id: 1,
    pageTitle: 'Top',
    url: SITE.rootPath,
  },
  {
    id: 2,
    pageTitle: '診断',
    url: `${SITE.rootPath}checker/`,
  },
  {
    id: 3,
    pageTitle: '診断結果',
    url: `${SITE.rootPath}checker/result/`,
  },
];

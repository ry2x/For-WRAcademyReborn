// News from RSS API//
export type RssWildRiftItem = {
  title: string;
  contents: string;
  link: string;
  retrieved: string;
};

// Data from RSS API
export type RssWildRift = {
  title: string;
  favicon: string;
  elements: RssWildRiftItem[];
};

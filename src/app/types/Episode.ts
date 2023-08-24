interface VideoToken {
  id: number;
  token: string;
}

interface Episode {
  id: number;
  title: string;
  showName?: string;
  thumbnailUrls: {
    small: string;
    medium: string;
    large: string;
  };
  distributionPublishingDate: string;
  videoTokens: {rbsc?: VideoToken; youtube?: VideoToken};
}

export default Episode;

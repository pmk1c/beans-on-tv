import VideoToken from "./VideoToken";

interface Episode {
  id: string;
  title: string;
  showName?: string;
  thumbnailUrls: {
    small: string;
    medium: string;
    large: string;
  };
  distributionPublishingDate: string;
  videoTokens: { rbsc?: VideoToken; youtube?: VideoToken };
  progress?: {
    progress: number;
    total: number;
  };
  watched?: boolean;
}

export default Episode;

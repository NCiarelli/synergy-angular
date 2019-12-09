import { ContentItem } from './content-item';

export interface Employee {
  name: string;
  textData: { contentItems: ContentItem[] };
  dominantPersonality?: string;
  personalityProfile?: {};
}

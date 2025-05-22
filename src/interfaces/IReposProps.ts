export interface ReposProps {
    id: string;
    name: string | null;
    description: string | null;
    url: string;
    topics: string[];
    previewImage?: string;
    publishedUrl?: string;
}
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: import.meta.env.NOTION_API_KEY,
});

export interface NotionPage {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  url?: string;
  image?: string;
  date?: string;
  featured?: boolean;
}

export interface BlogPost extends NotionPage {
  excerpt?: string;
  content?: string;
}

export interface Project extends NotionPage {
  technologies?: string[];
  github?: string;
  demo?: string;
}

export interface Certificate extends NotionPage {
  issuer?: string;
  credentialId?: string;
  level?: string;
}

function extractPlainText(richText: any[]): string {
  return richText?.map(text => text.plain_text).join('') || '';
}

function extractImageUrl(files: any[]): string | undefined {
  const file = files?.[0];
  if (file?.type === 'external') {
    return file.external.url;
  } else if (file?.type === 'file') {
    return file.file.url;
  }
  return undefined;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await notion.databases.query({
      database_id: import.meta.env.NOTION_DATABASE_PROJECTS,
      sorts: [
        {
          property: 'Featured',
          direction: 'descending',
        },
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: extractPlainText(page.properties.Title?.title || []),
      description: extractPlainText(page.properties.Description?.rich_text || []),
      category: page.properties.Category?.select?.name || 'General',
      technologies: page.properties.Technologies?.multi_select?.map((tech: any) => tech.name) || [],
      url: page.properties.URL?.url || '',
      github: page.properties.GitHub?.url || '',
      demo: page.properties.Demo?.url || '',
      image: extractImageUrl(page.properties.Image?.files || []),
      date: page.properties.Date?.date?.start || '',
      featured: page.properties.Featured?.checkbox || false,
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await notion.databases.query({
      database_id: import.meta.env.NOTION_DATABASE_BLOGS,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: extractPlainText(page.properties.Title?.title || []),
      excerpt: extractPlainText(page.properties.Excerpt?.rich_text || []),
      category: page.properties.Category?.select?.name || 'General',
      tags: page.properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      image: extractImageUrl(page.properties.Image?.files || []),
      date: page.properties.Date?.date?.start || '',
      featured: page.properties.Featured?.checkbox || false,
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const response = await notion.databases.query({
      database_id: import.meta.env.NOTION_DATABASE_CERTIFICATES,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: extractPlainText(page.properties.Title?.title || []),
      description: extractPlainText(page.properties.Description?.rich_text || []),
      category: page.properties.Category?.select?.name || 'General',
      issuer: extractPlainText(page.properties.Issuer?.rich_text || []),
      credentialId: extractPlainText(page.properties.CredentialId?.rich_text || []),
      level: page.properties.Level?.select?.name || 'Basic',
      image: extractImageUrl(page.properties.Image?.files || []),
      date: page.properties.Date?.date?.start || '',
      url: page.properties.URL?.url || '',
    }));
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
}

export async function getAboutContent(): Promise<any> {
  try {
    const response = await notion.pages.retrieve({
      page_id: import.meta.env.NOTION_PAGE_ABOUT,
    });

    return response;
  } catch (error) {
    console.error('Error fetching about content:', error);
    return null;
  }
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const blocks = await notion.blocks.children.list({ block_id: id });

    return {
      id: page.id,
      title: extractPlainText((page as any).properties.Title?.title || []),
      content: blocks.results.map((block: any) => {
        if (block.type === 'paragraph') {
          return extractPlainText(block.paragraph.rich_text);
        }
        return '';
      }).join('\n\n'),
      category: (page as any).properties.Category?.select?.name || 'General',
      tags: (page as any).properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      image: extractImageUrl((page as any).properties.Image?.files || []),
      date: (page as any).properties.Date?.date?.start || '',
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}
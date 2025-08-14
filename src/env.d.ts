/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly NOTION_API_KEY: string;
  readonly NOTION_DATABASE_PROJECTS: string;
  readonly NOTION_DATABASE_BLOGS: string;
  readonly NOTION_DATABASE_CERTIFICATES: string;
  readonly NOTION_PAGE_ABOUT: string;
  readonly EMAIL_USER: string;
  readonly EMAIL_PASS: string;
  readonly OWNER_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
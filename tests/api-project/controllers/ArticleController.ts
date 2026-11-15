import { APIRequestContext } from "@playwright/test";

export interface ArticleResponse {
  article: {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    category: string;
    visibility: string;
    allowComments: boolean;
    cover: string;
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: {
      username: string;
      bio: string;
      image: string;
      following: boolean;
    };
  };
}

export class ArticleController {
  private request: APIRequestContext;
  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createArticle(body: unknown): Promise<ArticleResponse> {
    // Authorization-заголовок вже додає фікстура request (base-fixture.ts)
    const response = await this.request.post("/api/articles", {
      data: body,
      failOnStatusCode: true,
    });
    return response.json();
  }
}

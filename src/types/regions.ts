// types/region.ts
export interface Region {
  region: string;
  cities: string[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  currency: string;
  quantity: string;
  weight?: string;
  sale?: string;
  saleType?: string;
  createDate: string;
  updateDate: string;
  photos: string[];
  city?: string;
}

export interface IProductResponse {
  status: string;
  data: IProduct[];
}

export interface IProductDetailResponse {
  status: string;
  data: IProduct;
}

export interface ICartItem {
  id: number;
  productId: number;
  userId: number;
  quantity: number;
  product: IProduct;
}

export interface ICartResponse {
  status: string;
  data: ICartItem[];
}

export interface ILikeItem {
  id: number;
  productId: number;
  userId: number;
  product: IProduct;
  createdAt: string;
}

export interface ILikeResponse {
  status: string;
  data: ILikeItem[];
}

export interface IUser {
  id: number;
  email: string;
  firstName?: string;
  secondName?: string;
  fullName?: string;
  avatarId?: string;
  phone?: string;
  roles?: any[];
  permissions?: any[];
}

export interface IAuthResponse {
  status: string;
  data: {
    access_token: string;
    user: IUser;
  };
}

export interface IApiResponse<T = any> {
  status: string;
  data: T;
  error?: string;
}

export interface ILikeActionResponse {
  status: string;
  data: {
    liked: boolean;
  };
}

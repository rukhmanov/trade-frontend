export interface IYandexResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
  cid: string;
}

export interface IUser {
  authId: string;
  firstName: null;
  secondName: null;
  fullName: string;
  email: string;
  avatarId: string;
  phone: string;
  birthDate: string;
  gender: string;
  authService: string;
  roles: Role[];
  permissions: Permission[];
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

export enum Platform {
  web = 'web',
  ios = 'ios',
  android = 'android',
}

export enum Service {
  yandex = 'yandex',
  google = 'yandex',
}

export enum Gender {
  male = 'male',
  femake = 'femake',
}

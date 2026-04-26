export type AuthUser = {
  id: string;
  username: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

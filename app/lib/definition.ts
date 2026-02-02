export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  userId: string;
};

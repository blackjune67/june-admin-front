export type MockSeedUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
};

export const mockSeedUsers: MockSeedUser[] = [
  {
    id: 1,
    name: "테스트 관리자",
    email: "admin@example.com",
    password: "12345678",
    role: "ADMIN",
    isActive: true,
  },
  {
    id: 2,
    name: "테스트 사용자",
    email: "user@example.com",
    password: "12345678",
    role: "USER",
    isActive: true,
  },
];

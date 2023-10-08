import { JsonValue } from "type-fest";

export type User = {
  createdAt: Date;
  fileUserImage: JsonValue;
  firstName: string | null;
  id: string;
  lastName: string | null;
  roles: JsonValue;
  updatedAt: Date;
  username: string;
};

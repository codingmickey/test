import { InputJsonValue } from "../../types";

export type UserCreateInput = {
  fileUserImage?: InputJsonValue;
  firstName?: string | null;
  lastName?: string | null;
  password: string;
  roles: InputJsonValue;
  username: string;
};

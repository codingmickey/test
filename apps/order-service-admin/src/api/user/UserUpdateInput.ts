import { InputJsonValue } from "../../types";

export type UserUpdateInput = {
  fileUserImage?: InputJsonValue;
  firstName?: string | null;
  lastName?: string | null;
  password?: string;
  roles?: InputJsonValue;
  username?: string;
};

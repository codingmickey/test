import { InputTypeDefinition } from "@nestjs/graphql/dist/schema-builder/factories/input-type-definition.factory";
import { diskStorage } from "multer";
import * as path from "path";
import { UserCreateInput } from "src/user/base/UserCreateInput";

export const generateMulterOptions = (
  entity: string
  //   fieldName: string
) => {
  return {
    storage: diskStorage({
      // Here public should be substituted with the path from user params
      destination: `public/${entity}`,
      filename: async (req, file, cb) => {
        console.log("hi", req.file, req.files, file);
        const prefix = file.fieldname;
        const extension = path.extname(file.originalname);
        const timestamp = new Date()
          .toISOString()
          .replace(/[-:]/g, "")
          .replace(/\.\d+/, ""); // Format the timestamp
        const generateRandomString = (length: number): string => {
          let result = "";
          const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          const charactersLength = characters.length;
          for (let i = 0; i < length; i++) {
            result += characters.charAt(
              Math.floor(Math.random() * charactersLength)
            );
          }
          return result;
        };
        const randomString = generateRandomString(8); // Generate an 8-character random string

        const fileName = `${prefix}_${timestamp}_${randomString}${extension}`;
        console.log(fileName);

        cb(null, fileName);
      },
    }),
  };
};

export const generateUploadFields = (fileFields: string[]) => {
  return Array.from(fileFields).map((fieldName) => {
    return {
      name: fieldName,
      maxCount: 1,
    };
  });
};

export type FilesType<T extends string> = {
  [key in T]?: Express.Multer.File[];
};

// type FileFieldsType<T extends string> = {
//   [key in T]: string;
// };

export const fileToJSON = <T>(
  data: T,
  fileNames: string[],
  files: {
    [key in (typeof fileNames)[number]]?: Express.Multer.File[];
  }
) => {
  fileNames.forEach((fileField) => {
    if (files?.[fileField]) {
      const { path: filePath, originalname, filename } = files[fileField]![0];
      (data as any)[fileField] = {
        filePath,
        fileExtension: path.extname(originalname),
        fileName: filename,
      };
    } else {
      (data as any)[fileField] = {
        fileExtension: null,
        filePath: null,
        fileName: null,
      };
    }
  });
};

// const userFiles = ["fileUserImage", "fileUserInvoice"] as const;

// export type UserFilesType = (typeof userFiles)[number];

// export type UserFiles = {
//   [key in UserFilesType]?: Multer.File[];
// };

// export const generateJSONfromFiles = (files: Multer

// export const deleteExistingFile = async ()

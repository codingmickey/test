import { diskStorage } from "multer";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import fs from "fs";
import path from "path";
import { UserCreateInput } from "src/user/base/UserCreateInput";
import crypto from "crypto";

export const generateMulterOptions = (
  entity: string
  //   fieldName: string
) => {
  return {
    storage: diskStorage({
      // TODO: Here public should be substituted with the path from user params
      destination: `public/${entity}`,
      filename: async (req, file, cb) => {
        console.log("hi", req.file, req.files, file);
        const prefix = file.fieldname;
        const extension = path.extname(file.originalname);
        const timestamp = new Date()
          .toISOString()
          .replace(/[-:]/g, "")
          .replace(/\.\d+/, ""); // Format the timestamp
        const uuid = crypto.randomUUID();

        const fileName = `${prefix}_${timestamp}_${uuid}${extension}`;
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

export type FileJSONType = {
  fileName: string;
  filePath: string;
  fileExtension: string;
};

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

// function createFoldersRecursively(filePath: string[], current: number): void {
//   if (current === filePath.length) {
//     return;
//   }

//   const tempPath = filePath.slice(0, current + 1).join("/");
//   console.log(tempPath);
//   if (!fs.existsSync(tempPath)) {
//     fs.mkdirSync(tempPath);
//   }

//   return createFoldersRecursively(filePath, current + 1);
// }

export const graphqlUpload = async (
  file: FileUpload,
  fieldName: string
): Promise<{ [key: string]: FileJSONType }> => {
  try {
    const chunks = [];
    for await (const chunk of file.createReadStream()) {
      chunks.push(chunk);
    }

    // TODO: path From env
    const rootFolderPath = "public";
    const entity = "user";
    const filePath = path.join(__dirname, "..", "..", rootFolderPath, entity);

    // TODO: Need to refactor this when the path is inputed by the user.. and make different folders
    // Create a public directory if it doesn't exist
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    // // Create a directory in a path if it doesn't exist
    // const dir = path.join(__dirname, "..", "..", "public", "user");
    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir);
    // }

    // Save the file into the public/user folder
    // console.log(filePath.split("/").splice(1));
    // createFoldersRecursively(filePath.split("/").splice(1), 0);

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d+/, ""); // Format the timestamp
    const uuid = crypto.randomUUID();

    const extension = path.extname(file.filename);

    const fileName = `${filePath}/${fieldName}_${timestamp}_${uuid}${extension}`;

    // fs.writeFile(fileName, Buffer.concat(chunks), (err) => {
    //   if (err) throw err;
    //   console.log("File saved successfully!");
    // });

    console.log(fileName);

    fs.writeFileSync(fileName, Buffer.concat(chunks));

    const fileBuffer = Buffer.concat(chunks);
    const fileContent = fileBuffer.toString("utf8");

    return {
      [fieldName]: {
        fileName: `${fieldName}_${timestamp}_${uuid}${extension}`,
        fileExtension: extension,
        filePath: fileName,
      },
    };
  } catch (err) {
    console.log("FDJSKLFJDS", err);
    throw err;
  }
};

type graphqlFileType = {
  file: FileUpload;
  entity: string;
};

export const graphqlUploadMultiple = async <T, U>(
  args: U,
  graphqlFiles: graphqlFileType[]
): Promise<{ newArgs: U; fileContent: { [x: string]: FileJSONType }[] }> => {
  const fileContent = await Promise.all(
    graphqlFiles.map((file) => {
      return graphqlUpload(file.file, file.entity);
    })
  );

  graphqlFiles.forEach((file, index) => {
    (args as any).data[file.entity] = fileContent[index][file.entity];
    delete (args as any)[file.entity];
  });

  return { newArgs: args, fileContent };
};

export const generateGraphqlUploadArgs = (fileFields: string[]) => {
  return fileFields.map((fieldName) => {
    return {
      name: fieldName,
      type: () => GraphQLUpload,
    };
  });
};
// const userFiles = ["fileUserImage", "fileUserInvoice"] as const;

// export type UserFilesType = (typeof userFiles)[number];

// export type UserFiles = {
//   [key in UserFilesType]?: Multer.File[];
// };

// export const generateJSONfromFiles = (files: Multer

// export const deleteExistingFile = async ()

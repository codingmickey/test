// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from "@nestjs/common";
// import { Observable } from "rxjs";
// import { tap } from "rxjs/operators";
// import * as path from "path";

// @Injectable()
// export class FileToJSONInterceptor implements NestInterceptor {
//   private readonly userFiles: readonly string[];

//   constructor(userFiles: readonly string[]) {
//     this.userFiles = userFiles;
//   }

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();
//     const files = request.files as {
//       [key in (typeof this.userFiles)[number]]?: Express.Multer.File[];
//     };

//     return next.handle().pipe(
//       tap(() => {
//         const data: any = request.body;

//         this.userFiles.forEach((fileField) => {
//           if (files?.[fileField]) {
//             const {
//               path: filePath,
//               originalname,
//               filename,
//             } = files[fileField]![0];
//             data[fileField] = {
//               filePath,
//               fileExtension: path.extname(originalname),
//               fileName: filename,
//             };
//           } else {
//             data[fileField] = {
//               fileExtension: null,
//               filePath: null,
//               fileName: null,
//             };
//           }
//         });

//         request.body = data;
//       })
//     );
//   }
// }

// server/uploadthing.ts
import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  menuImageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      return {}; // auth logic if needed
    })
    .onUploadComplete(async ({ file }) => {
      // optional: save somewhere
      console.log("Image uploaded:", file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;


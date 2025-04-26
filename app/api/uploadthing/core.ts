import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "16MB",
      maxFileCount: 10,
    },
  })
    .middleware(async () => {
      // We don't need auth here since we're handling it at the route level
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      // Return the file URL to be used in the client
      return { url: file.url };
    }),

  // Agent profile picture uploader
  agentProfileUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { userId: "user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),

  //Location image picture
  LocationImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
      .middleware(async () => {
        return { userId: "user" };
      })
      .onUploadComplete(async ({ metadata, file }) => {
        return { url: file.url };
      }),

  //FloorPlan
  FloorPlanUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
      .middleware(async () => {
        return { userId: "user" };
      })
      .onUploadComplete(async ({ metadata, file }) => {
        return { url: file.url };
      }),

  //Document Uploader
  DocumentUploader: f({
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 5,
    },
    text: {
      maxFileSize: "16MB",
      maxFileCount: 5,
    },
    image: {
      maxFileSize: "16MB",
      maxFileCount: 5,
    },
  })
      .middleware(async () => {
        return { userId: "user" };
      })
      .onUploadComplete(async ({ metadata, file }) => {
        return { url: file.url };
      }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

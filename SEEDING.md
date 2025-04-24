# Database Seeding Instructions

## Why `npx db:seed` is not working

The command `npx db:seed` is not working because `db:seed` is not an npm package but a script defined in your `package.json` file. The `npx` command is used to execute packages from the npm registry, not to run scripts defined in your project.

## How to run the seed command

You have several options to run the seed command:

1. **Using npm run:**
   ```
   npm run db:seed
   ```
   This runs the script defined in your package.json file.

2. **Using Prisma's built-in seed command:**
   ```
   npx prisma db seed
   ```
   This runs the seed script defined in the "prisma" section of your package.json file.

3. **Using ts-node directly:**
   ```
   npx ts-node -r tsconfig-paths/register prisma/seed.ts
   ```
   This directly executes the seed.ts file with ts-node.

## Additional seeding commands

Your project also has these additional seeding commands:

- **Seed agents:**
  ```
  npm run seed:agents
  ```
  This runs the script to seed agent data.

## Troubleshooting

### "Unknown file extension '.ts'" Error

If you encounter an error like this:
```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for D:\Projects\Projects\Estate\mls\prisma\seed.ts
```

This is caused by a conflict between ESM and CommonJS module systems in the TypeScript configuration. The solution is:

1. Make sure your tsconfig.json has the correct ts-node configuration:
   ```json
   "ts-node": {
     "compilerOptions": {
       "module": "CommonJS"
     }
   }
   ```

2. Use the updated seed command in package.json:
   ```json
   "prisma": {
     "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
   }
   ```

### Other Common Issues

If you encounter any other issues with the seeding process:

1. Make sure your database connection is properly configured
2. Check that all required dependencies are installed
3. Verify that the path to the seed file is correct
4. Ensure that the TypeScript configuration is properly set up

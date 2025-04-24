# Migration Instructions

## Issue
The error message indicates that there's a problem with adding the required `name` column to the `locations` table:

```
Step 0 Added the required column `name` to the `locations` table without a default value. There are 4 rows in this table, it is not possible to execute this step.
```

## Solution
We've made the following changes to fix this issue:

1. Modified the `schema.prisma` file to add a default empty string value for the `name` field in the `Location` model
2. Updated the `seed.ts` file to include the `name` field when creating locations
3. Created a script to update existing locations to set their `name` field to match their `city` field

## Steps to Apply the Fix

### 1. Apply the Schema Changes
Run the following command to apply the schema changes:

```bash
npx prisma migrate dev --name add_name_field_with_default
```

This will create a new migration that adds the `name` field with a default value.

### 2. Update Existing Locations
Run the script to update existing locations:

```bash
npx ts-node scripts/update-location-names.ts
```

This will update all existing locations to set their `name` field to match their `city` field if the `name` field is empty.

### 3. Verify the Fix
You can verify that the fix has been applied by checking the database:

```bash
npx prisma studio
```

This will open Prisma Studio in your browser, where you can view the `locations` table and verify that all locations have a `name` field with a value.
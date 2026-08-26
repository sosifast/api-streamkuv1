import { z } from "zod";

export const MovieUrlSchema = z.object({
  movieId: z.string().min(1, "Movie ID is required"),
  streamUrl1: z.string().url("Must be a valid URL").min(1, "Stream URL 1 is required"),
  streamUrl2: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.null()]).optional(),
  streamUrl3: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.null()]).optional(),
  streamUrl4: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.null()]).optional(),
  streamUrl5: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.null()]).optional(),
});

export const DramaUrlSchema = z.object({
  movieId: z.string().min(1, "Movie ID is required"),
  episode: z.coerce.number().int().min(1, "Episode must be at least 1"),
  streamUrl1: z.string().url("Must be a valid URL").min(1, "Stream URL 1 is required"),
  streamUrl2: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.null()]).optional(),
  streamUrl3: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.null()]).optional(),
  streamUrl4: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.null()]).optional(),
  streamUrl5: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.null()]).optional(),
});

export const CountrySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

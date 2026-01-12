import { z } from "zod";
import { insertTestResultSchema } from "./schema";

export const api = {
  speedTest: {
    ping: {
      method: 'GET' as const,
      path: '/api/ping',
      responses: {
        200: z.object({ timestamp: z.number() }),
      },
    },
    download: {
      method: 'GET' as const,
      path: '/api/download-test',
      // We can request a specific size in bytes via query param
      input: z.object({ sizeBytes: z.coerce.number().optional() }).optional(),
      responses: {
        200: z.any(), // Returns binary data
      },
    },
    upload: {
      method: 'POST' as const,
      path: '/api/upload-test',
      input: z.any(), // Accepts binary data
      responses: {
        200: z.object({ sizeReceived: z.number() }),
      },
    },
    saveResult: {
      method: 'POST' as const,
      path: '/api/results',
      input: insertTestResultSchema,
      responses: {
        201: z.custom<any>(), // Returns saved result
      },
    },
    getHistory: {
      method: 'GET' as const,
      path: '/api/results',
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
  },
};

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

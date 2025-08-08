import { pgTable, text, timestamp, varchar, boolean, date } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  uCode: varchar('u_code', { length: 25 }).primaryKey(),
  uName: varchar('u_name', { length: 255 }),
  uFirstName: varchar('u_first_name', { length: 100 }),
  uLastName: varchar('u_last_name', { length: 100 }),
  uMiddleName: varchar('u_middle_name', { length: 100 }),
  uNickname: varchar('u_nickname', { length: 50 }),
  uDOB: date('u_dob'),
  uGender: varchar('u_gender', { length: 20 }),
  
  // Contact information
  uEmail: varchar('u_email', { length: 255 }),
  uPhoneNumber: varchar('u_phone_number', { length: 20 }),
  
  // Security fields
  uPasswordHash: varchar('u_password_hash', { length: 255 }),
  uPasswordConfirmHash: varchar('u_password_confirm_hash', { length: 255 }),
  uTwoFactorEnabled: boolean('u_two_factor_enabled').notNull().default(false),
  uTwoFactorSecret: varchar('u_two_factor_secret', { length: 255 }),
  
  // Status and verification
  uIsActive: boolean('u_is_active').notNull().default(true),
  uIsVerified: boolean('u_is_verified').notNull().default(false),
  uEmailVerifiedAt: timestamp('u_email_verified_at'),
  uPhoneVerifiedAt: timestamp('u_phone_verified_at'),
  uLastLoginAt: timestamp('u_last_login_at'),
  
  // Profile and preferences
  uProfilePicture: text('u_profile_picture'),
  uBio: text('u_bio'),
  uLanguage: varchar('u_language', { length: 10 }).default('en'),
  uTimezone: varchar('u_timezone', { length: 50 }),
  uPreferences: text('u_preferences'), // JSON
  
  // Address information
  uAddress: text('u_address'),
  uCity: varchar('u_city', { length: 100 }),
  uState: varchar('u_state', { length: 100 }),
  uCountry: varchar('u_country', { length: 100 }),
  uZipCode: varchar('u_zip_code', { length: 20 }),
  
  // Password reset functionality
  uPasswordResetToken: varchar('u_password_reset_token', { length: 255 }),
  uPasswordResetExpires: timestamp('u_password_reset_expires'),
  uEmailVerificationToken: varchar('u_email_verification_token', { length: 255 }),
  
  // Role and permissions
  // rCode: varchar('r_code', { length: 3 }).references(() => roles.rCode),
  
  // Audit fields
  uCreatedAt: timestamp('u_created_at').notNull().defaultNow(),
  uLastCreatedBy: varchar('u_last_created_by', { length: 25 }),
  uLastUpdateAt: timestamp('u_last_update_at').notNull().defaultNow(),
  uNotes: text('u_notes'), // Admin notes
});

// Drizzle-generated schemas (simplified)
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

// Validation schemas for specific operations
export const userRegistrationSchema = z.object({
  uCode: z.string().min(1, "User code is required").max(25),
  uEmail: z.string().email("Invalid email format").max(255),
  uPasswordHash: z.string().min(8, "Password must be at least 8 characters").max(255),
  uPasswordConfirmHash: z.string().min(8, "Password confirmation required").max(255),
  uName: z.string().min(1, "Name is required").max(255).optional(),
  uPhoneNumber: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number").optional(),
  uGender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  uDOB: z.string().optional(),
}).refine((data) => data.uPasswordHash === data.uPasswordConfirmHash, {
  message: "Passwords don't match",
  path: ["uPasswordConfirmHash"],
});

export const userLoginSchema = z.object({
  uEmail: z.string().email("Invalid email format"),
  uPasswordHash: z.string().min(1, "Password is required"),
});

export const userProfileUpdateSchema = z.object({
  uName: z.string().min(1).max(255).optional(),
  uFirstName: z.string().max(100).optional(),
  uLastName: z.string().max(100).optional(),
  uMiddleName: z.string().max(100).optional(),
  uNickname: z.string().max(50).optional(),
  uBio: z.string().optional(),
  uPhoneNumber: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number").optional(),
  uAddress: z.string().optional(),
  uCity: z.string().max(100).optional(),
  uState: z.string().max(100).optional(),
  uCountry: z.string().max(100).optional(),
  uZipCode: z.string().max(20).optional(),
  uTimezone: z.string().max(50).optional(),
  uLanguage: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, "Invalid language code").optional(),
  uProfilePicture: z.string().url("Invalid URL").optional(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>;

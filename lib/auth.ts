import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { getUsersCollection, getSessionsCollection } from './db';

// Environment variables validation
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d'; // 7 days
const SALT_ROUNDS = 12; // Higher salt rounds for better security

// User validation schemas
export const SignUpSchema = z.object({
  email: z.string().email('Invalid email address').max(254).toLowerCase().trim(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  firstName: z.string().min(1, 'First name is required').max(50).trim(),
  lastName: z.string().min(1, 'Last name is required').max(50).trim(),
});

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address').max(254).toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// User interface for database
export interface UserDocument {
  _id: ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isEmailVerified: boolean;
  failedLoginAttempts: number;
  lockedUntil?: Date;
}

// User interface for API responses
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isEmailVerified: boolean;
  failedLoginAttempts: number;
  lockedUntil?: Date;
}

// Session interface
export interface Session {
  _id: string;
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Password verification
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT token generation
export function generateAccessToken(userId: string): string {
  return jwt.sign(
    { 
      userId,
      type: 'access'
    },
    JWT_SECRET,
    { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'eden-perfume',
      audience: 'eden-perfume-users'
    }
  );
}

// Refresh token generation
export function generateRefreshToken(): string {
  return jwt.sign(
    { 
      type: 'refresh',
      random: Math.random().toString(36).substring(2)
    },
    JWT_SECRET,
    { 
      expiresIn: '30d', // 30 days
      issuer: 'eden-perfume',
      audience: 'eden-perfume-users'
    }
  );
}

// JWT token verification
export function verifyToken(token: string): { userId?: string; type: string; valid: boolean } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'eden-perfume',
      audience: 'eden-perfume-users'
    }) as any;
    
    return {
      userId: decoded.userId,
      type: decoded.type,
      valid: true
    };
  } catch (error) {
    return { valid: false, type: 'invalid' };
  }
}

// Convert UserDocument to User
function convertUserDocument(userDoc: UserDocument): User {
  return {
    _id: userDoc._id.toString(),
    email: userDoc.email,
    firstName: userDoc.firstName,
    lastName: userDoc.lastName,
    createdAt: userDoc.createdAt,
    updatedAt: userDoc.updatedAt,
    lastLoginAt: userDoc.lastLoginAt,
    isEmailVerified: userDoc.isEmailVerified,
    failedLoginAttempts: userDoc.failedLoginAttempts,
    lockedUntil: userDoc.lockedUntil,
  };
}

// User creation
export async function createUser(userData: z.infer<typeof SignUpSchema>): Promise<User> {
  const usersCollection = await getUsersCollection();
  
  // Check if user already exists
  const existingUser = await usersCollection.findOne({ 
    email: userData.email 
  });
  
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Hash password
  const passwordHash = await hashPassword(userData.password);
  
  // Create user
  const now = new Date();
  const user: Omit<UserDocument, '_id'> = {
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    passwordHash,
    createdAt: now,
    updatedAt: now,
    isEmailVerified: false,
    failedLoginAttempts: 0,
  };
  
  const result = await usersCollection.insertOne(user);
  
  // Get the created user and return without password hash
  const createdUser = await usersCollection.findOne({ _id: result.insertedId }) as UserDocument;
  return convertUserDocument(createdUser);
}

// User authentication
export async function authenticateUser(email: string, password: string, userAgent?: string, ipAddress?: string): Promise<{
  user: User;
  accessToken: string;
  refreshToken: string;
}> {
  const usersCollection = await getUsersCollection();
  
  // Find user by email
  const user = await usersCollection.findOne({ email }) as UserDocument | null;
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const remainingTime = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 1000 / 60);
    throw new Error(`Account is locked. Try again in ${remainingTime} minutes`);
  }
  
  // Verify password
  const isValidPassword = await verifyPassword(password, user.passwordHash);
  
  if (!isValidPassword) {
    // Increment failed login attempts
    const failedAttempts = (user.failedLoginAttempts || 0) + 1;
    const updateData: any = { 
      failedLoginAttempts: failedAttempts,
      updatedAt: new Date()
    };
    
    // Lock account after 5 failed attempts for 15 minutes
    if (failedAttempts >= 5) {
      updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    }
    
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: updateData }
    );
    
    throw new Error('Invalid email or password');
  }
  
  // Reset failed login attempts on successful login
  await usersCollection.updateOne(
    { _id: user._id },
    { 
      $set: { 
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        updatedAt: new Date()
      }
    }
  );
  
  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken();
  
  // Store refresh token
  const sessionsCollection = await getSessionsCollection();
  await sessionsCollection.insertOne({
    userId: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    createdAt: new Date(),
    userAgent,
    ipAddress
  });
  
  return {
    user: convertUserDocument(user),
    accessToken,
    refreshToken
  };
}

// Refresh token validation
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  user: User;
}> {
  const sessionsCollection = await getSessionsCollection();
  const usersCollection = await getUsersCollection();
  
  // Find session
  const session = await sessionsCollection.findOne({ 
    refreshToken,
    expiresAt: { $gt: new Date() }
  });
  
  if (!session) {
    throw new Error('Invalid or expired refresh token');
  }
  
  // Get user
  const user = await usersCollection.findOne({ _id: session.userId }) as UserDocument | null;
  
  if (!user) {
    // Clean up invalid session
    await sessionsCollection.deleteOne({ _id: session._id });
    throw new Error('User not found');
  }
  
  // Generate new access token
  const accessToken = generateAccessToken(user._id.toString());
  
  return {
    accessToken,
    user: convertUserDocument(user)
  };
}

// Logout (invalidate refresh token)
export async function logout(refreshToken: string): Promise<void> {
  const sessionsCollection = await getSessionsCollection();
  await sessionsCollection.deleteOne({ refreshToken });
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  const usersCollection = await getUsersCollection();
  
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) }) as UserDocument | null;
    
    if (!user) {
      return null;
    }
    
    return convertUserDocument(user);
  } catch (error) {
    return null;
  }
}

// Clean up expired sessions (run periodically)
export async function cleanupExpiredSessions(): Promise<void> {
  const sessionsCollection = await getSessionsCollection();
  await sessionsCollection.deleteMany({
    expiresAt: { $lt: new Date() }
  });
} 
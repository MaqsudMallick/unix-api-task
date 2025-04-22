import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Request } from 'express';
import { Session } from 'express-session';

// DTO used for user registration
export class UserDTO {
  @IsNotEmpty() // Ensures the name is provided
  @IsString()   // Validates the name is a string
  name!: string;

  @IsNotEmpty() // Ensures the email is provided
  @IsEmail()    // Validates the email format
  email!: string;

  @IsNotEmpty()  // Ensures the password is provided
  @IsString()    // Validates the password is a string
  @MinLength(6)  // Enforces a minimum password length
  password!: string;
}

// DTO used for user login
export class LoginDTO {
  @IsNotEmpty() // Ensures the email is provided
  @IsEmail()    // Validates email format
  email!: string;

  @IsNotEmpty() // Ensures the password is provided
  @IsString()   // Validates the password is a string
  password!: string;
}

// Extends Express's Request to include authenticated session data
export interface AuthenticatedRequest extends Request {
  session: Session & {
    userId?: string; // Stores the logged-in user's ID
    email?: string;  // Stores the logged-in user's email
  };
}

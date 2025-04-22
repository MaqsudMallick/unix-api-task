import { prisma } from "../lib/prisma";
import { User } from "@prisma/client";
import bcrypt from 'bcrypt';

// Fetch a user by their unique ID
export const getUser = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

// Fetch a user by their email address
export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// Create a new user with a hashed password
export const createUser = async (userData: Omit<User, 'id'>) => {
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  // Create the user in the database with the hashed password
  const createdUser = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });
  
  // Exclude password from returned response
  const { password, ...userWithoutPassword } = createdUser;
  return userWithoutPassword;
};

// Delete a user and all their tasks
export const deleteUser = async (id: string) => {
  // First delete all tasks associated with the user
  await prisma.task.deleteMany({
    where: { userId: id },
  });

  // Then delete the user
  const deletedUser = await prisma.user.delete({
    where: { id },
  });
  
  return deletedUser;
};

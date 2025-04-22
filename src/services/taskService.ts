import { Task } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { Status } from "../models/taskModel";

// Retrieve all tasks in the system (useful for admin/debug purposes)
export const getAllTasks = async () => {
  return await prisma.task.findMany();
};

// Retrieve all tasks associated with a specific user
export const getTasksByUserId = async (userId: string) => {
  return await prisma.task.findMany({
    where: { userId },
  });
};

// Get a single task by its unique ID
export const getTaskById = async (id: string) => {
  return await prisma.task.findUnique({
    where: { id },
  });
};

// Create a new task (automatically sets to COMPLETED after a delay)
export const createTask = async (task: Omit<Task, 'id' | 'timestamp' | 'updatedAt'>) => {
  const createdTask = await prisma.task.create({
    data: task,
  });

  // Simulate task processing delay: mark as COMPLETED after 1 minute
  setTimeout(() => {
    createdTask.status = Status.COMPLETED;
    updateTask(createdTask.id, createdTask); // Persist the updated status
  }, 60 * 1000); // 60 seconds

  return createdTask;
};

// Update an existing task by its ID
export const updateTask = async (id: string, task: Partial<Task>) => {
  const updatedTask = await prisma.task.update({
    where: { id },
    data: task,
  });
  return updatedTask;
};

// Delete a task by its ID
export const deleteTask = async (id: string) => {
  const deletedTask = await prisma.task.delete({
    where: { id },
  });
  return deletedTask;
};

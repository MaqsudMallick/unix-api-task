import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

// Enum representing the possible statuses of a task
export enum Status {
    PROCESSING = 'processing',
    COMPLETED = 'completed',
}

// DTO for creating a new task
export class TaskDTO {
    @IsString() // Ensures name is a string
    @IsNotEmpty() // Ensures name is not an empty string
    name!: string;
}

// DTO for updating an existing task
export class TaskUpdateDto {
    @IsOptional() // Field is optional during update
    @IsString() // If provided, must be a string
    name?: string;

    @IsOptional() // Field is optional during update
    @IsEnum(Status, {
        message: 'Status must be either "processing" or "completed"' // Custom error message
    }) // If provided, must be one of the defined Status enum values
    status?: Status;
}

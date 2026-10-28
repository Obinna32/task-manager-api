const { z } = require('zod');

const createTaskSchema = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title is required'}).min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
        description: z.string().optional(),
        status: z.enum(['todo', 'in_progress', 'done']).optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        dueDate: z.string().optional(),
        tags: z.array(z.string()).optional()
    })
});

const updateTaskSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(100).optional(),
        description: z.string().optional(),
        status: z.enum(['todo', 'in_progress', 'done']).optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        dueDate: z.string().optional(),
        tags: z.array(z.string()).optional()
    })
});

module.exports =  { createTaskSchema, updateTaskSchema }
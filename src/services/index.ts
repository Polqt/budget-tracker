import { CategoryService } from './categoryService';
import { TransactionService } from './transactionService';

// Create service instances
export const categoryService = new CategoryService();
export const transactionService = new TransactionService();

export { CategoryService, TransactionService };

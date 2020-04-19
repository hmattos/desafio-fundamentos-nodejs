import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import ListTransactionsService from './ListTransactionsService';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: RequestDTO): Transaction {
    const listTransactionsService = new ListTransactionsService(
      this.transactionsRepository,
    );

    const transactionsResponse = listTransactionsService.execute();

    if (type === 'outcome' && value > transactionsResponse.balance.total) {
      throw Error('Do not have income.');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface TransactionsResponse {
  transactions: Transaction[];
  balance: {
    income: number;
    outcome: number;
    total: number;
  };
}

class ListTransactionsService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute(): TransactionsResponse {
    const transactionsResponse = this.transactionsRepository.all();
    const sumIncome = transactionsResponse.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, obj) => sum + obj.value, 0);

    const sumOutcome = transactionsResponse.transactions
      .filter(t => t.type === 'outcome')
      .reduce((sum, obj) => sum + obj.value, 0);

    transactionsResponse.balance = {
      income: sumIncome,
      outcome: sumOutcome,
      total: sumIncome - sumOutcome,
    };

    return transactionsResponse;
  }
}

export default ListTransactionsService;

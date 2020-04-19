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
    const { sumIncome, sumOutcome } = transactionsResponse.transactions.reduce(
      (accumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.sumIncome += transaction.value;
            break;
          case 'outcome':
            accumulator.sumOutcome += transaction.value;
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        sumIncome: 0,
        sumOutcome: 0,
      },
    );

    transactionsResponse.balance = {
      income: sumIncome,
      outcome: sumOutcome,
      total: sumIncome - sumOutcome,
    };

    return transactionsResponse;
  }
}

export default ListTransactionsService;

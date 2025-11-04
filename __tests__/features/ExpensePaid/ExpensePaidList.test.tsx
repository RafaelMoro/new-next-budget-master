import { render, screen } from '@testing-library/react';
import { ExpensePaidList } from '@/features/Records/ExpensePaid/ExpensePaidList';
import { 
  expensePaidListMock1, 
  expensePaidListMock2, 
  expensePaidListMock3 
} from '../../mocks/records.mock';

describe('ExpensePaidList', () => {
  it('should render an empty list when no expenses are provided', () => {
    render(<ExpensePaidList expenses={[]} />);
    
    // ListGroup should be rendered but with no items
    const listGroup = screen.getByRole('list');
    expect(listGroup).toBeInTheDocument();
    expect(listGroup).toBeEmptyDOMElement();
  });

  it('should render a single expense correctly', () => {
    render(<ExpensePaidList expenses={[expensePaidListMock1]} />);
    
    // Check if the expense details are rendered
    expect(screen.getByText('Coffee Shop Purchase')).toBeInTheDocument();
    expect(screen.getByText('- $150.00')).toBeInTheDocument();
    expect(screen.getByText('Mar, 1 Jul, 2025')).toBeInTheDocument();
    
    // Check if the text has correct styling classes
    const shortName = screen.getByText('Coffee Shop Purchase');
    expect(shortName).toHaveClass('text-start', 'text-base');
    
    const amount = screen.getByText('- $150.00');
    expect(amount).toHaveClass('place-self-center', 'text-red-500');
    
    const date = screen.getByText('Mar, 1 Jul, 2025');
    expect(date).toHaveClass('text-xs', 'text-gray-600', 'dark:text-gray-400', 'col-span-2');
  });

  it('should render multiple expenses correctly', () => {
    const expenses = [expensePaidListMock1, expensePaidListMock2, expensePaidListMock3];
    render(<ExpensePaidList expenses={expenses} />);
    
    // Check if all expenses are rendered
    expect(screen.getByText('Coffee Shop Purchase')).toBeInTheDocument();
    expect(screen.getByText('Grocery Store')).toBeInTheDocument();
    expect(screen.getByText('Gas Station Fill-up')).toBeInTheDocument();
    
    // Check if all amounts are rendered with negative sign
    expect(screen.getByText('- $150.00')).toBeInTheDocument();
    expect(screen.getByText('- $2,500.00')).toBeInTheDocument();
    expect(screen.getByText('- $5,000.00')).toBeInTheDocument();
    
    // Check if all dates are rendered
    expect(screen.getByText('Mar, 1 Jul, 2025')).toBeInTheDocument();
    expect(screen.getByText('Mie, 2 Jul, 2025')).toBeInTheDocument();
    expect(screen.getByText('Jue, 3 Jul, 2025')).toBeInTheDocument();
  });

  it('should render each expense as a list item with correct key', () => {
    const expenses = [expensePaidListMock1, expensePaidListMock2];
    render(<ExpensePaidList expenses={expenses} />);
    
    // Check if ListGroupItems are rendered
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    
    // Check if each list item has the correct class
    listItems.forEach(item => {
      expect(item).toHaveClass('max-w-screen');
    });
  });

  it('should handle expenses with different amounts correctly', () => {
    const expenses = [expensePaidListMock1, expensePaidListMock2, expensePaidListMock3];
    render(<ExpensePaidList expenses={expenses} />);
    
    // Check different formatted amounts
    expect(screen.getByText('- $150.00')).toBeInTheDocument(); // Small amount
    expect(screen.getByText('- $2,500.00')).toBeInTheDocument(); // Medium amount with comma
    expect(screen.getByText('- $5,000.00')).toBeInTheDocument(); // Large amount with comma
  });

  it('should display the correct grid layout for each expense item', () => {
    render(<ExpensePaidList expenses={[expensePaidListMock1]} />);
    
    // Find the container div inside the list item
    const gridContainer = screen.getByText('Coffee Shop Purchase').closest('div');
    expect(gridContainer).toHaveClass(
      'w-full',
      'grid',
      'grid-cols-2',
      'grid-rows-2',
      'gap-2'
    );
  });

  it('should render expenses with long names correctly', () => {
    const longNameExpense = {
      ...expensePaidListMock1,
      shortName: 'Very Long Expense Name That Might Overflow The Container'
    };
    
    render(<ExpensePaidList expenses={[longNameExpense]} />);
    
    expect(screen.getByText('Very Long Expense Name That Might Overflow The Container')).toBeInTheDocument();
  });

  it('should render expenses with zero amount correctly', () => {
    const zeroAmountExpense = {
      ...expensePaidListMock1,
      amount: 0,
      amountFormatted: '$0.00'
    };
    
    render(<ExpensePaidList expenses={[zeroAmountExpense]} />);
    
    expect(screen.getByText('- $0.00')).toBeInTheDocument();
  });

  it('should handle expenses with special characters in shortName', () => {
    const specialCharExpense = {
      ...expensePaidListMock1,
      shortName: 'Expense & Special Chars (test) - 100%'
    };
    
    render(<ExpensePaidList expenses={[specialCharExpense]} />);
    
    expect(screen.getByText('Expense & Special Chars (test) - 100%')).toBeInTheDocument();
  });

  it('should render expenses in the order they are provided', () => {
    const expenses = [expensePaidListMock3, expensePaidListMock1, expensePaidListMock2];
    render(<ExpensePaidList expenses={expenses} />);
    
    const listItems = screen.getAllByRole('listitem');
    
    // Check the order by checking text content of each list item
    expect(listItems[0]).toHaveTextContent('Gas Station Fill-up');
    expect(listItems[1]).toHaveTextContent('Coffee Shop Purchase');
    expect(listItems[2]).toHaveTextContent('Grocery Store');
  });
});

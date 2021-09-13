import { render, screen } from '@testing-library/react';
import App from './App';

test('renders right header', () => {
    render(<App />);
    const header = screen.getByText('Historical performance of Google(Alphabet Inc.) by GOOGL and GOOG stocks:');
    expect(header).toBeInTheDocument();
});

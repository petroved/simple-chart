import { render, waitFor } from '@testing-library/react';
import StockChart from './StockChart';

test('resize element is in the dom', async () => {
    const { container } = render(<StockChart symbol="GOOGL" />);
    const resizeEl = await waitFor(() => container.querySelector('.resize-triggers'));

    expect(resizeEl).toBeInTheDocument();
});

import { render, screen} from '@testing-library/react'; 
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),  
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders the app and handles fetch', async () => {
  render(<App />);

  const titleElement = screen.getByText(/Calculatrice NPI/i);
  expect(titleElement).toBeInTheDocument();

  const buttonElement = screen.getByText(/Calculer/i);
  expect(buttonElement).toBeInTheDocument();

  const historyElement = screen.getByText(/Historique des opérations/i);
  expect(historyElement).toBeInTheDocument();
});

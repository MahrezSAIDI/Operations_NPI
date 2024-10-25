import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import fetch from 'jest-fetch-mock'; 
import OperationsHome from './OperationsHome';


beforeEach(() => {
  fetch.resetMocks();
});

test('renders without crashing and displays initial elements', () => {
  
  fetch.mockResponseOnce(JSON.stringify([]));
  render(<OperationsHome />);

  // Assert
  expect(screen.getByText(/Calculatrice NPI/i)).toBeInTheDocument();
  expect(screen.getByText(/Les opérateurs autorisés sont/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Ex: 3 4 \+/i)).toBeInTheDocument();
  expect(screen.getByText(/Exporter en CSV/i)).toBeInTheDocument();
});

test('validates invalid NPI expression and prevents submission', async () => {
    render(<OperationsHome />);

    const input = screen.getByPlaceholderText(/Ex: 3 4 \+/i);
    const submitButton = screen.getByRole('button', { name: /Calculer/i });

    fireEvent.change(input, { target: { value: '3 +' } }); 
    expect(submitButton).toBeDisabled(); 

});
  
  

test('validates valid NPI expression and allows submission', async () => {
 
  fetch.mockResponseOnce(JSON.stringify([])); 
  fetch.mockResponseOnce(JSON.stringify({ result: 7 })); 

  render(<OperationsHome />);

  const input = screen.getByPlaceholderText(/Ex: 3 4 \+/i);
  const submitButton = screen.getByText(/Calculer/i);

  
  fireEvent.change(input, { target: { value: '3 4 +' } });

  
  await waitFor(() => {
    expect(submitButton).not.toBeDisabled(); 
  });

  fireEvent.click(submitButton);

  
  await waitFor(() => {
    expect(screen.getByText(/Résultat : 7/i)).toBeInTheDocument();
  });
});

test('fetches and displays operations history', async () => {
  const mockOperations = [
    { id: 1, expression: '3 4 +', result: 7 },
    { id: 2, expression: '5 2 -', result: 3 },
  ];
  fetch.mockResponseOnce(JSON.stringify(mockOperations));

  
  render(<OperationsHome />);

  await waitFor(() => {
    expect(screen.getByText('3 4 +')).toBeInTheDocument();
  });
  
  await waitFor(() => {
    expect(screen.getByText('7')).toBeInTheDocument();
  });
  
  await waitFor(() => {
    expect(screen.getByText('5 2 -')).toBeInTheDocument();
  });
  
  await waitFor(() => {
    expect(screen.getByText('3')).toBeInTheDocument();
  });
  
});

test('handles server error during fetch', async () => {
    
    fetch.mockRejectOnce(new Error('Erreur lors de la récupération des opérations'));
  
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    render(<OperationsHome />);
  
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur:', expect.any(Error));
    });
  
    consoleErrorSpy.mockRestore();
  });
  

test('exports CSV correctly when clicked', () => {
  
  const mockOperations = [
    { id: 1, expression: '3 4 +', result: 7 },
    { id: 2, expression: '5 2 -', result: 3 },
  ];
  fetch.mockResponseOnce(JSON.stringify(mockOperations));

  render(<OperationsHome />);

  // Simuler la fonction click sur le bouton Export CSV
  global.URL.createObjectURL = jest.fn();
  const csvButton = screen.getByText(/Exporter en CSV/i);
  fireEvent.click(csvButton);

  // Vérifiez si l'exportation en CSV a été déclenchée
  expect(global.URL.createObjectURL).toHaveBeenCalled();
});

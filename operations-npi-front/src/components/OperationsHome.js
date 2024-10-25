import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function OperationsHome() {
    const [operations, setOperations] = useState([]);
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isValidExpression, setIsValidExpression] = useState(true); 

    const apiUrl = process.env.REACT_APP_API_URL
    

    useEffect(() => {
        fetch(`${apiUrl}/operations`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des opérations');
                }
                return response.json();
            })
            .then(data => setOperations(data))
            .catch(error => console.error('Erreur:', error));
    }, []);

    function validateNPI(expression) {
        const operators = {
            '+': 2, '-': 2, '*': 2, '/': 2, '//': 2, '^': 2,
            'sin': 1, 'cos': 1, 'sqrt': 1, 
        };
        const variables = {}; 
        let stack = [];
    
        const tokens = expression.trim().split(/\s+/);
    
        for (const token of tokens) {
            if (!isNaN(token)) {
                stack.push(Number(token));
            } else if (operators[token] !== undefined) {
                const operandCount = operators[token];
                
                if (stack.length < operandCount) {
                    // Pas assez d'opérandes dans la pile pour cet opérateur
                    return false;
                }
    
                let args = [];
                for (let i = 0; i < operandCount; i++) {
                    args.push(stack.pop());
                }
    
                
                stack.push(0); 
            } else if (token.startsWith(':')) {
                const varName = token.slice(1);
                variables[varName] = stack[stack.length - 1]; 
            } else if (variables[token] !== undefined) {
                stack.push(variables[token]);
            } else {
                
                return false;
            }
        }
    
        
        return stack.length === 1;
    }
    

    const handleExpressionChange = (e) => {
        const expr = e.target.value;
        setExpression(expr);
        setIsValidExpression(validateNPI(expr));  // Met à jour si l'expression est valide
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValidExpression) {
            alert('Expression NPI invalide. Veuillez entrer une expression valide.');
            return;
        }
        setLoading(true);

        fetch(`${apiUrl}/calculate`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ expression }),
        })
        .then(response => response.json())
        .then(data => {
            setLoading(false);
            if (data.error) {
                console.error('Erreur:', data.error);
            } else {
                setResult(data.result);
                setOperations([...operations, { id: operations.length + 1, ...data }]);
            }
        })
        .catch(error => {
            setLoading(false);
            console.error('Erreur:', error);
        });
    };

    const exportToCSV = () => {
        const headers = ["Expression, Résultat"];
        const csvData = operations.map(operation =>
            `${operation.expression},${operation.result}`
        );

        const csvContent = headers.concat(csvData).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'operations.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container my-5">
            <div className="card p-4" style={{ backgroundColor: '#007FFF' }}>
                <h1 className="card-title text-center" style={{ fontWeight: 'bold' }}>Calculatrice NPI</h1>
                <p className="text-center " style={{ fontWeight: 'bold' }}>
                Les opérateurs autorisés sont : +  -  *  /  %  sin  cos // sqrt  ^ 
                </p>
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="input-group mb-3">
                        <span className="input-group-text" style={{ fontWeight: 'bold' }}>Expression NPI : </span>
                        <input
                            type="text"
                            className="form-control"
                            style={{ backgroundColor: isValidExpression ? '#f8f9fa' : '#ffcccc', borderColor: isValidExpression ? '#6c757d' : '#ff0000' }} 
                            value={expression}
                            onChange={handleExpressionChange}
                            required
                            placeholder="Ex: 3 4 +"
                        />
                        <button
                            type="submit"
                            className="btn"
                            disabled={loading || !isValidExpression}
                            style={{ backgroundColor: '#FFD700', color: '#000000', fontWeight:'bold' }}
                        >
                            {loading ? 'Calculating...' : 'Calculer'}
                        </button>
                    </div>
                </form>

                {result !== null && (
                    <div className="alert alert-success text-center" style={{ fontWeight: 'bold' }}>
                        <h2 className="alert-heading">Résultat : {result}</h2>
                    </div>
                )}

                
                <div className="d-flex justify-content-start mb-3">
                    <button
                        onClick={exportToCSV}
                        className="btn btn-success w-auto"
                        style={{ backgroundColor: '#FFD700', color: '#000000', width: '100px',fontWeight:'bold'  }}
                    >
                        Exporter en CSV
                    </button>
                </div>

                <h2 className="text-start mb-3" style={{ fontWeight: 'bold' }}>Historique des opérations</h2>
                
                <table className="table table-striped" style={{ backgroundColor: '#007FFF' }}>
                    <thead>
                        <tr >
                            <th className="pe-1" style={{ width: '40%' ,fontWeight:'bold'}}>Expression</th>
                            <th className="ps-1" style={{ width: '40%',fontWeight:'bold' }}>Résultat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operations.map(operation => (
                            <tr key={operation.id} >
                                <td className="pe-1">{operation.expression}</td>
                                <td className="ps-1">{operation.result}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OperationsHome;

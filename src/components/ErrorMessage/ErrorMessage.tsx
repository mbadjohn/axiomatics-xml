import { useState } from "react";

interface ErrorMessageProps {
    message: string;
    details?: string | null; // Allow string, undefined, or null
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, details = '' }) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => setShowDetails(!showDetails);

    return (
        <div className="error-message">
            <p>{message}</p>
            {details && (
                <>
                    <button onClick={toggleDetails} className="details-button">
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                    {showDetails && <pre>{details}</pre>}
                </>
            )}
        </div>
    );
};

export default ErrorMessage;
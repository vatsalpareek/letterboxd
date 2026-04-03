import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const BrutalSelect = ({ options, value, onChange, placeholder = "SELECT_OPTION" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(o => o.value === value);
    const displayLabel = selectedOption ? selectedOption.label : placeholder;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="brutal-select-container" ref={containerRef}>
            <div 
                className={`brutal-select-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{displayLabel.toUpperCase()}</span>
                <ChevronDown 
                    size={20} 
                    className={`select-chevron ${isOpen ? 'rotated' : ''}`} 
                />
            </div>

            {isOpen && (
                <ul className="brutal-select-options">
                    {options.map((opt) => (
                        <li 
                            key={opt.value} 
                            className={`select-option ${opt.value === value ? 'selected' : ''}`}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                        >
                            {opt.label.toUpperCase()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BrutalSelect;

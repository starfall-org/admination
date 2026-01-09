'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal, X, Send, ChevronUp, ChevronDown } from 'lucide-react';
import { useDatabaseStore } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';

interface SQLHistoryItem {
  query: string;
  timestamp: Date;
  result?: any;
  error?: string;
}

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 
  'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'PRIMARY', 'KEY',
  'FOREIGN', 'REFERENCES', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER',
  'ON', 'AS', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'IN', 'LIKE', 'BETWEEN',
  'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'DISTINCT', 'COUNT',
  'SUM', 'AVG', 'MIN', 'MAX', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'UNION', 'ALL', 'WITH', 'AS', 'CTE'
];

interface SQLShellProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function SQLShell({ isOpen, setIsOpen }: SQLShellProps) {
  const { t } = useI18nStore();
  const { connection, tables } = useDatabaseStore();
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<SQLHistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get table names for auto-completion
  const tableNames = tables.map(t => t.name);

  // Auto-completion logic
  const getSuggestions = useCallback((text: string) => {
    const words = text.toUpperCase().split(/\s+/);
    const currentWord = words[words.length - 1];
    
    if (!currentWord) return [];
    
    let matches: string[] = [];
    
    // Check SQL keywords
    matches = SQL_KEYWORDS.filter(keyword => 
      keyword.startsWith(currentWord) && !words.includes(keyword)
    );
    
    // Check table names
    const tableMatches = tableNames.filter(table => 
      table.toUpperCase().startsWith(currentWord) && !words.includes(table.toUpperCase())
    );
    
    matches = [...matches, ...tableMatches];
    
    // Remove duplicates and limit to 10
    return Array.from(new Set(matches)).slice(0, 10);
  }, [tableNames]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Get suggestions for current word
    const newSuggestions = getSuggestions(value);
    setSuggestions(newSuggestions);
    setSelectedSuggestion(0);
    setShowSuggestions(newSuggestions.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        applySuggestion();
      } else if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        executeQuery();
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    } else {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        executeQuery();
      } else if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        navigateHistory(-1);
      } else if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        navigateHistory(1);
      }
    }
  };

  const applySuggestion = () => {
    if (suggestions.length === 0) return;
    
    const words = query.split(/\s+/);
    words[words.length - 1] = suggestions[selectedSuggestion];
    const newQuery = words.join(' ');
    setQuery(newQuery);
    setShowSuggestions(false);
    
    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const navigateHistory = (direction: number) => {
    if (direction === -1 && historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setQuery(history[history.length - 1 - newIndex].query);
    } else if (direction === 1 && historyIndex > -1) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setQuery(newIndex === -1 ? '' : history[history.length - 1 - newIndex].query);
    }
  };

  const executeQuery = async () => {
    if (!query.trim() || !connection) return;
    
    setIsExecuting(true);
    const trimmedQuery = query.trim();
    
    try {
      const response = await fetch('/api/sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: trimmedQuery,
          url: connection.url,
          type: connection.type,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Query execution failed');
      }
      
      // Add to history
      const historyItem: SQLHistoryItem = {
        query: trimmedQuery,
        timestamp: new Date(),
        result: result.data,
      };
      
      setHistory(prev => [...prev, historyItem]);
      setHistoryIndex(-1);
      setQuery('');
    } catch (error) {
      const historyItem: SQLHistoryItem = {
        query: trimmedQuery,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      
      setHistory(prev => [...prev, historyItem]);
    } finally {
      setIsExecuting(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setHistoryIndex(-1);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [query]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full h-full max-h-screen flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Terminal className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t('sqlShell')}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {connection?.type?.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={clearHistory}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {t('clearHistory')}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Query Input */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                placeholder={t('queryPlaceholder')}
                className="w-full px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={3}
                style={{ minHeight: '80px', maxHeight: '300px' }}
              />
              
              {/* Auto-complete suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10"
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion}
                      className={`px-4 py-3 cursor-pointer text-sm font-mono ${
                        index === selectedSuggestion
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => {
                        setSelectedSuggestion(index);
                        applySuggestion();
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('pressCtrlEnter')}, {t('pressTab')}
              </div>
              <button
                onClick={executeQuery}
                disabled={isExecuting || !query.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-base font-medium"
              >
                <Send size={18} />
                <span>{isExecuting ? t('executing') : t('executeQuery')}</span>
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-6">
            {history.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <Terminal className="w-16 h-16 mx-auto mb-6 opacity-50" />
                <p className="text-lg">{t('noQueriesExecuted')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.slice().reverse().map((item, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between">
                      <code className="text-sm font-mono text-gray-800 dark:text-gray-200 flex-1 mr-4">
                        {item.query}
                      </code>
                      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {item.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="p-4">
                      {item.error ? (
                        <div className="text-red-600 dark:text-red-400 text-sm font-medium">
                          {t('error')}: {item.error}
                        </div>
                      ) : item.result ? (
                        <div className="overflow-x-auto">
                          {Array.isArray(item.result) && item.result.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                  <tr>
                                    {Object.keys(item.result[0]).map(key => (
                                      <th key={key} className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                                        {key}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                  {item.result.slice(0, 100).map((row: any, i: number) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                      {Object.values(row).map((value: any, j: number) => (
                                        <td key={j} className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                          {value === null ? (
                                            <span className="text-gray-400 italic">NULL</span>
                                          ) : (
                                            String(value)
                                          )}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                              {t('queryHistory')} {item.result.affectedRows ? `${item.result.affectedRows} ${t('rowsAffected')}` : ''}
                            </div>
                          )}
                          {Array.isArray(item.result) && item.result.length > 100 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                              {t('showingResults')} 100 {t('ofRows')} {item.result.length} {t('rows')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {t('queryHistory')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// app/admin/students/components/DebugCookies.tsx
'use client';

import { useEffect, useState } from 'react';

export function DebugCookies() {
    const [cookies, setCookies] = useState<Record<string, string>>({});
    const [runSession, setRunSession] = useState<string | null>(null);
    const [activeTheme, setActiveTheme] = useState<string | null>(null);
    const [cookieDetails, setCookieDetails] = useState<Array<{ name: string, value: string, length: number }>>([]);
    const [sessionDetails, setSessionDetails] = useState<any>(null);
    const [rawDocumentCookie, setRawDocumentCookie] = useState<string>('');

    useEffect(() => {
        // Get raw document.cookie first
        const rawCookieString = document.cookie;
        setRawDocumentCookie(rawCookieString);

        console.log('Raw document.cookie:', rawCookieString);
        console.log('document.cookie length:', rawCookieString.length);

        // Get all cookies using different parsing methods
        const allCookies: Record<string, string> = {};
        const details: Array<{ name: string, value: string, length: number }> = [];

        // Method 1: Standard parsing
        rawCookieString.split(';').forEach(cookie => {
            const [name, ...valueParts] = cookie.trim().split('=');
            if (name) {
                const value = valueParts.join('=');
                allCookies[name] = value;
                details.push({
                    name,
                    value,
                    length: value.length
                });
                console.log(`Found cookie: ${name} = ${value.substring(0, 20)}...`);
            }
        });

        // Method 2: Manual parsing for edge cases
        if (!allCookies['run_session']) {
            console.log('run_session not found with standard parsing, trying manual search...');
            const runSessionMatch = rawCookieString.match(/run_session=([^;]+)/);
            if (runSessionMatch) {
                const value = runSessionMatch[1];
                allCookies['run_session'] = value;
                console.log('Found run_session manually:', value.substring(0, 20) + '...');
            }
        }

        setCookies(allCookies);
        setCookieDetails(details);

        // Check for specific cookies
        const runSessionValue = allCookies['run_session'];
        const activeThemeValue = allCookies['active_theme'];

        setRunSession(runSessionValue || null);
        setActiveTheme(activeThemeValue || null);

        console.log('run_session found:', !!runSessionValue);
        console.log('active_theme found:', !!activeThemeValue);

        // Try to parse run_session if it exists
        if (runSessionValue) {
            try {
                console.log('Attempting to decode run_session...');
                const decoded = decodeURIComponent(runSessionValue);
                console.log('Decoded run_session (first 100 chars):', decoded.substring(0, 100));

                try {
                    const parsed = JSON.parse(decoded);
                    setSessionDetails(parsed);
                    console.log('Successfully parsed run_session as JSON:', Object.keys(parsed));
                } catch (jsonError) {
                    console.log('run_session is not valid JSON, using raw value');
                    setSessionDetails({ raw: decoded.substring(0, 100) + '...' });
                }
            } catch (decodeError) {
                console.error('Failed to decode run_session:', decodeError);
                setSessionDetails({ error: 'Failed to decode', raw: runSessionValue.substring(0, 100) });
            }
        }

        // Check all possible cookie names
        const allPossibleNames = ['run_session', 'session', 'auth_session', 'user_session', 'token', 'auth_token', 'jwt', 'access_token'];
        allPossibleNames.forEach(name => {
            if (allCookies[name]) {
                console.log(`✓ Found ${name} cookie`);
            }
        });

    }, []);

    const testCookieParsing = () => {
        console.log('=== Cookie Parsing Test ===');
        console.log('document.cookie:', document.cookie);

        // Different parsing methods
        const methods = [
            { name: 'Standard split', func: () => document.cookie.split(';') },
            { name: 'Regex match all', func: () => Array.from(document.cookie.matchAll(/([^=]+)=([^;]+)/g)) },
            {
                name: 'Manual regex', func: () => {
                    const cookies: Record<string, string> = {};
                    document.cookie.replace(/([^=]+)=([^;]+);?/g, (match, name, value) => {
                        cookies[name.trim()] = value.trim();
                        return '';
                    });
                    return cookies;
                }
            }
        ];

        methods.forEach(method => {
            try {
                console.log(`${method.name}:`, method.func());
            } catch (e) {
                console.error(`${method.name} failed:`, e);
            }
        });
    };

    const testAPIManually = () => {
        const token = runSession;
        if (!token) {
            alert('No run_session token found!');
            return;
        }

        console.log('Testing API with token...');
        console.log('Token length:', token.length);
        console.log('Token preview:', token.substring(0, 20) + '...');

        fetch('http://localhost:3001/api/v1/academic-sessions', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(async r => {
                const responseText = await r.text();
                console.log('Manual fetch response:', {
                    status: r.status,
                    statusText: r.statusText,
                    ok: r.ok,
                    headers: Object.fromEntries(r.headers.entries()),
                    body: responseText.substring(0, 500)
                });

                if (!r.ok) {
                    alert(`API Error: ${r.status} ${r.statusText}\nCheck console for details.`);
                } else {
                    alert('API call successful! Check console for response.');
                }
            })
            .catch(error => {
                console.error('Manual fetch error:', error);
                alert(`Fetch error: ${error.message}`);
            });
    };

    return (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-xs">
            <h3 className="font-bold text-red-700">Cookie Debug Info:</h3>

            <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded border">
                        <p><strong>run_session exists:</strong> {runSession ? '✅ YES' : '❌ NO'}</p>
                        {runSession && (
                            <>
                                <p><strong>Length:</strong> {runSession.length}</p>
                                <p><strong>Preview:</strong> {runSession.substring(0, 50)}...</p>
                            </>
                        )}
                    </div>

                    <div className="bg-white p-2 rounded border">
                        <p><strong>active_theme exists:</strong> {activeTheme ? '✅ YES' : '❌ NO'}</p>
                        {activeTheme && (
                            <>
                                <p><strong>Length:</strong> {activeTheme.length}</p>
                                <p><strong>Value:</strong> {activeTheme}</p>
                            </>
                        )}
                    </div>
                </div>

                {runSession && (
                    <div className="mt-2">
                        <button
                            onClick={() => {
                                try {
                                    const decoded = decodeURIComponent(runSession);
                                    try {
                                        const parsed = JSON.parse(decoded);
                                        console.log('Parsed run_session:', parsed);
                                        alert('Check console for parsed session data');
                                    } catch (e) {
                                        console.log('run_session raw decoded:', decoded);
                                        alert('run_session is not valid JSON');
                                    }
                                } catch (e) {
                                    console.error('Failed to decode run_session:', e);
                                    alert('Failed to decode run_session');
                                }
                            }}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded mr-2"
                        >
                            Parse run_session
                        </button>

                        <button
                            onClick={testCookieParsing}
                            className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded mr-2"
                        >
                            Test Parsing Methods
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <details>
                    <summary className="cursor-pointer font-semibold">Raw document.cookie</summary>
                    <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40 mt-1">
                        {rawDocumentCookie || '(empty)'}
                    </pre>
                </details>
            </div>

            <div className="mt-2">
                <details>
                    <summary className="cursor-pointer font-semibold">All Cookies ({cookieDetails.length})</summary>
                    <div className="bg-gray-100 p-2 rounded max-h-40 overflow-auto mt-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-1">Name</th>
                                    <th className="p-1">Length</th>
                                    <th className="p-1">Preview</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cookieDetails.map((cookie, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-200">
                                        <td className="p-1 font-mono">{cookie.name}</td>
                                        <td className="p-1">{cookie.length}</td>
                                        <td className="p-1 font-mono text-xs">
                                            {cookie.name === 'run_session' || cookie.name === 'token'
                                                ? cookie.value.substring(0, 20) + '...'
                                                : cookie.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </details>
            </div>

            {sessionDetails && (
                <div className="mt-2">
                    <details>
                        <summary className="cursor-pointer font-semibold">Session Details</summary>
                        <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40 mt-1">
                            {JSON.stringify(sessionDetails, null, 2)}
                        </pre>
                    </details>
                </div>
            )}

            <div className="mt-4">
                <button
                    onClick={testAPIManually}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded font-medium"
                    disabled={!runSession}
                >
                    Test API Manually {runSession ? '' : '(no token)'}
                </button>

                <button
                    onClick={() => {
                        // Clear and reload cookies
                        setCookies({});
                        setRunSession(null);
                        setActiveTheme(null);
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    }}
                    className="ml-2 px-3 py-2 bg-green-100 text-green-700 rounded font-medium"
                >
                    Reload & Re-check
                </button>
            </div>

            <div className="mt-4 text-xs text-gray-600">
                <p><strong>Note:</strong> Check browser DevTools → Application → Cookies to see what cookies are actually stored.</p>
                <p>If run_session exists there but not here, it might be:</p>
                <ul className="list-disc ml-4 mt-1">
                    <li>HTTP-only cookie (inaccessible to JavaScript)</li>
                    <li>Set with SameSite=Strict for different domain</li>
                    <li>Set with a path that doesn't include this page</li>
                    <li>Expired or cleared</li>
                </ul>
            </div>
        </div>
    );
}
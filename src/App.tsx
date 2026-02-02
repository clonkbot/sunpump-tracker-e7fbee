import { useState, useEffect, useCallback } from 'react';
import './styles.css';

interface Token {
  id: string;
  name: string;
  symbol: string;
  contractAddress: string;
  deployedAt: Date;
  creator: string;
  initialSupply: string;
  status: 'new' | 'active' | 'rug';
}

// Generate realistic mock data
const generateMockToken = (): Token => {
  const names = ['PEPE TRON', 'SunDoge', 'TronMoon', 'JustinCoin', 'SunPepe', 'TRXElonMusk', 'BONKTRON', 'WIFTRON', 'TronCat', 'MoonTRX', 'SunShiba', 'TronFrog', 'BRETTRON', 'ANDYTRON', 'WOJAKTRON', 'POPCAT TRX', 'GIGACHAD TRX', 'MOODENG TRX', 'GOATTRON', 'NEIROTRON'];
  const symbols = ['PTRX', 'SDOGE', 'TMOON', 'JST2', 'SPEPE', 'TRELON', 'BONKT', 'WIFT', 'TCAT', 'MTRX', 'SSHIB', 'TFROG', 'BRETT', 'ANDY', 'WOJAK', 'POPT', 'GIGA', 'MDENG', 'GOAT', 'NEIRO'];
  const idx = Math.floor(Math.random() * names.length);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  let addr = 'T';
  for (let i = 0; i < 33; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }

  let creator = 'T';
  for (let i = 0; i < 33; i++) {
    creator += chars[Math.floor(Math.random() * chars.length)];
  }

  const supplies = ['1000000000', '420690000000', '69420000000', '1000000000000', '777777777777'];

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: names[idx],
    symbol: symbols[idx],
    contractAddress: addr,
    deployedAt: new Date(Date.now() - Math.random() * 3600000),
    creator: creator,
    initialSupply: supplies[Math.floor(Math.random() * supplies.length)],
    status: Math.random() > 0.1 ? 'new' : 'active'
  };
};

function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [flashingId, setFlashingId] = useState<string | null>(null);
  const [glitchText, setGlitchText] = useState('SUNPUMP TRACKER');

  // Initialize with some tokens
  useEffect(() => {
    const initial = Array.from({ length: 8 }, generateMockToken);
    setTokens(initial.sort((a, b) => b.deployedAt.getTime() - a.deployedAt.getTime()));
  }, []);

  // Simulate new token arrivals
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newToken = generateMockToken();
      newToken.deployedAt = new Date();
      setFlashingId(newToken.id);
      setTokens(prev => [newToken, ...prev].slice(0, 50));

      setTimeout(() => setFlashingId(null), 2000);
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Glitch effect on title
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const original = 'SUNPUMP TRACKER';
      const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
      let glitched = '';
      for (let i = 0; i < original.length; i++) {
        if (Math.random() > 0.9) {
          glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        } else {
          glitched += original[i];
        }
      }
      setGlitchText(glitched);
      setTimeout(() => setGlitchText('SUNPUMP TRACKER'), 100);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTime = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const formatSupply = (supply: string) => {
    const num = parseFloat(supply);
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    return supply;
  };

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  return (
    <div className="app">
      <div className="scanlines" />
      <div className="noise" />

      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="tron-logo">
              <svg viewBox="0 0 64 64" className="tron-icon">
                <polygon points="32,4 60,56 32,44 4,56" fill="currentColor" />
              </svg>
            </div>
            <div className="title-block">
              <h1 className="glitch-title" data-text={glitchText}>{glitchText}</h1>
              <p className="subtitle">TRON MAINNET // CHAIN ID: 728126428</p>
            </div>
          </div>

          <div className="controls">
            <div className="status-indicator">
              <span className={`pulse-dot ${isLive ? 'live' : 'paused'}`} />
              <span className="status-text">{isLive ? 'LIVE FEED' : 'PAUSED'}</span>
            </div>
            <button
              className={`toggle-btn ${isLive ? 'active' : ''}`}
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? 'PAUSE' : 'RESUME'}
            </button>
          </div>
        </div>

        <div className="stats-bar">
          <div className="stat">
            <span className="stat-label">TOKENS TRACKED</span>
            <span className="stat-value">{tokens.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">LAST UPDATE</span>
            <span className="stat-value">{tokens[0] ? formatTime(tokens[0].deployedAt) : '--'}</span>
          </div>
          <div className="stat">
            <span className="stat-label">NETWORK</span>
            <span className="stat-value">SUNPUMP</span>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="table-container">
          <div className="table-header">
            <div className="col col-status">STATUS</div>
            <div className="col col-token">TOKEN</div>
            <div className="col col-contract">CONTRACT</div>
            <div className="col col-creator">CREATOR</div>
            <div className="col col-supply">SUPPLY</div>
            <div className="col col-time">DEPLOYED</div>
          </div>

          <div className="table-body">
            {tokens.map((token, index) => (
              <div
                key={token.id}
                className={`table-row ${flashingId === token.id ? 'flash-new' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="col col-status">
                  <span className={`status-badge ${token.status}`}>
                    {token.status === 'new' ? 'NEW' : token.status === 'active' ? 'ACTIVE' : 'RUG'}
                  </span>
                </div>
                <div className="col col-token">
                  <div className="token-info">
                    <span className="token-symbol">${token.symbol}</span>
                    <span className="token-name">{token.name}</span>
                  </div>
                </div>
                <div className="col col-contract">
                  <button
                    className="address-btn"
                    onClick={() => copyToClipboard(token.contractAddress)}
                    title="Click to copy"
                  >
                    {formatAddress(token.contractAddress)}
                    <span className="copy-icon">&#x2398;</span>
                  </button>
                </div>
                <div className="col col-creator">
                  <button
                    className="address-btn"
                    onClick={() => copyToClipboard(token.creator)}
                    title="Click to copy"
                  >
                    {formatAddress(token.creator)}
                  </button>
                </div>
                <div className="col col-supply">
                  <span className="supply-value">{formatSupply(token.initialSupply)}</span>
                </div>
                <div className="col col-time">
                  <span className="time-value">{formatTime(token.deployedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="footer">
        <span>Requested by @wenxora · Built by @clonkbot</span>
      </footer>
    </div>
  );
}

export default App;
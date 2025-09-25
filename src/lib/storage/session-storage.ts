// Session storage utilities for serverless environment
// This provides a simple abstraction for session management

export interface SessionData {
  id: string;
  data: any;
  timestamp: number;
  expiresAt: number;
}

export class SessionStorage {
  private static sessions = new Map<string, SessionData>();
  private static readonly DEFAULT_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  static set(sessionId: string, data: any, timeout: number = this.DEFAULT_TIMEOUT): void {
    const now = Date.now();
    const sessionData: SessionData = {
      id: sessionId,
      data,
      timestamp: now,
      expiresAt: now + timeout
    };
    
    this.sessions.set(sessionId, sessionData);
    this.cleanup();
  }

  static get(sessionId: string): any | null {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return null;
    }

    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session.data;
  }

  static delete(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  static has(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return false;
    }

    return true;
  }

  static cleanup(): void {
    const now = Date.now();
    this.sessions.forEach((session, sessionId) => {
      if (now > session.expiresAt) {
        this.sessions.delete(sessionId);
      }
    });
  }

  static getSessionCount(): number {
    this.cleanup();
    return this.sessions.size;
  }

  static clear(): void {
    this.sessions.clear();
  }
}

// Auto cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    SessionStorage.cleanup();
  }, 5 * 60 * 1000);
}

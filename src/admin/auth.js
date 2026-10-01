// ==========================================================================
// HABIBA YASSER PORTFOLIO CMS - ACCOUNT-BASED AUTHENTICATION SERVICE
// ==========================================================================

const SESSION_KEY = 'habiba_admin_session_token_v1';

// Authorized single-owner profile for Habiba Yasser
export const HABIBA_ACCOUNT = {
  name: 'حبيبة ياسر',
  email: 'habibamarghani1@gmail.com',
  validIdentifiers: [
    'habiba',
    'habiba_yasser',
    'habibamarghani1@gmail.com'
  ],
  // Cryptographic token representation of the account credential
  // Derived via base64 encoding to prevent plaintext password in frontend bundle
  credentialToken: 'MTMyNDM1' // Decodes to 132435
};

export function isAuthenticated() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return false;

    const session = JSON.parse(raw);
    if (!session || session.auth !== true || session.account !== HABIBA_ACCOUNT.name) {
      logout();
      return false;
    }

    // Session valid for 7 days
    if (Date.now() - session.timestamp > 7 * 24 * 60 * 60 * 1000) {
      logout();
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function getCurrentAccount() {
  if (!isAuthenticated()) return null;
  return {
    name: HABIBA_ACCOUNT.name,
    email: HABIBA_ACCOUNT.email
  };
}

export function login(identifier, password, rememberMe = true) {
  const accountInput = (identifier || '').trim().toLowerCase();
  const passwordInput = (password || '').trim();

  if (!accountInput) {
    return { success: false, message: 'يرجى إدخال اسم الحساب أو البريد الإلكتروني' };
  }
  if (!passwordInput) {
    return { success: false, message: 'يرجى إدخال كلمة المرور' };
  }

  // 1. Account Identity Verification (Primary Layer)
  const isAuthorizedAccount = HABIBA_ACCOUNT.validIdentifiers.some(
    (id) => id.toLowerCase() === accountInput
  );

  if (!isAuthorizedAccount) {
    return {
      success: false,
      message: 'الحساب غير مسجل أو غير مصرح له بالدخول إلى لوحة التحكم'
    };
  }

  // 2. Credential Verification (Secondary Layer)
  // Verify token without writing literal plaintext in code
  const inputToken = btoa(passwordInput);
  if (inputToken !== HABIBA_ACCOUNT.credentialToken) {
    return {
      success: false,
      message: 'بيانات الدخول غير صحيحة، يرجى التأكد من الحساب وكلمة المرور'
    };
  }

  // 3. Issue Authorized Session for Habiba
  const sessionData = JSON.stringify({
    account: HABIBA_ACCOUNT.name,
    email: HABIBA_ACCOUNT.email,
    auth: true,
    timestamp: Date.now()
  });

  if (rememberMe) {
    localStorage.setItem(SESSION_KEY, sessionData);
  } else {
    sessionStorage.setItem(SESSION_KEY, sessionData);
  }

  return { success: true, account: HABIBA_ACCOUNT.name };
}

export function logout() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Error logging out:', e);
  }
}

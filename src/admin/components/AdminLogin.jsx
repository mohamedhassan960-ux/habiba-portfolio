import React, { useState } from 'react';
import { login } from '../auth';

export default function AdminLogin({ onLoginSuccess }) {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!account.trim()) {
      setErrorMsg('يرجى إدخال اسم الحساب أو البريد الإلكتروني');
      triggerShake();
      return;
    }
    if (!password.trim()) {
      setErrorMsg('يرجى إدخال كلمة المرور');
      triggerShake();
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = login(account, password);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.message || 'بيانات الدخول غير صحيحة');
        triggerShake();
      }
    } catch {
      setErrorMsg('حدث خطأ أثناء تسجيل الدخول');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleBackToSite = () => {
    window.location.hash = '';
    window.location.reload();
  };

  return (
    <div className="admin-login-wrap">
      <div className={`admin-login-card ${isShaking ? 'login-shake' : ''}`}>
        {/* Retro Window Header */}
        <div className="admin-login-head">
          <div className="win-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <span className="font-bold text-sm tracking-wide">لوحة التحكم ✿ Habiba CMS</span>
          <button
            type="button"
            className="retro-modal-close"
            onClick={handleBackToSite}
            title="العودة للموقع العام"
          >
            ✕
          </button>
        </div>

        {/* Login Body */}
        <div className="admin-login-body">
          <div className="admin-login-avatar" aria-hidden="true">
            🎨
          </div>

          <h1 className="admin-login-title">أهلاً بكِ حبيبة ✿</h1>
          <p className="admin-login-sub">
            سجّلي الدخول بحسابكِ للوصول إلى لوحة إدارة محتوى الـ Portfolio
          </p>

          <form onSubmit={handleSubmit}>
            {/* Account / Username / Email Field */}
            <div className="admin-input-group">
              <label className="admin-input-label" htmlFor="admin-account">
                حساب المصممة (اسم المستخدم أو البريد):
              </label>
              <div className="admin-input-box">
                <input
                  id="admin-account"
                  type="text"
                  className="admin-input"
                  dir="ltr"
                  placeholder="habiba أو habibamarghani1@gmail.com"
                  value={account}
                  onChange={(e) => {
                    setAccount(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="admin-input-group">
              <label className="admin-input-label" htmlFor="admin-pass">
                كلمة المرور:
              </label>
              <div className="admin-input-box">
                <input
                  id="admin-pass"
                  type={showPassword ? 'text' : 'password'}
                  className="admin-input"
                  dir="ltr"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  required
                />
                <button
                  type="button"
                  className="admin-input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>

              {errorMsg && (
                <p className="text-red-500 text-xs font-bold mt-2 flex items-center gap-1">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? (
                <span>جاري التحقق...</span>
              ) : (
                <>
                  <span>دخول لوحة التحكم</span>
                  <span>➜</span>
                </>
              )}
            </button>

            <a
              href="#/"
              className="admin-back-link"
              onClick={(e) => {
                e.preventDefault();
                handleBackToSite();
              }}
            >
              الرجوع إلى معرض الأعمال العام (بدون تعديل)
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}

import React from "react";

type Props = {
  badge: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode; // 우측 상단 버튼들 (홈/로그인/회원가입/내정보 등)
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AuthShell({
  badge,
  title,
  subtitle,
  right,
  children,
  footer,
}: Props) {
  return (
    <div className="mp-bg">
      <div className="mp-wrap">
        <div className="mp-card">
          <div className="mp-top">
            <div className="mp-brand">
              <div className="mp-brand__title">MemberPass</div>
              <span className="mp-badge">{badge}</span>
            </div>
            <div className="mp-actions">{right}</div>
          </div>

          <h1 className="mp-h1">{title}</h1>
          {subtitle ? <p className="mp-sub">{subtitle}</p> : null}

          {children}

          {footer ? <div style={{ marginTop: 12 }}>{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

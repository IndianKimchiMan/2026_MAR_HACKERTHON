/**
 * authService.ts
 * Supabase Auth 래퍼 — 회원가입 / 로그인 / 로그아웃
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface AuthResult {
  success: boolean;
  name?: string;
  error?: string;
}

/** 회원가입 */
export async function signUp(name: string, email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured || !supabase) {
    // Supabase 미설정 시 mock 처리 (개발용)
    return { success: true, name };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) return { success: false, error: error.message };

  const needsConfirmation = !data.session;
  if (needsConfirmation) {
    return { success: false, error: '가입 확인 이메일을 발송했습니다. 이메일을 확인 후 로그인해주세요.' };
  }

  return { success: true, name };
}

/** 로그인 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured || !supabase) {
    // Supabase 미설정 시 mock 처리 (개발용)
    const mockName = email.split('@')[0];
    return { success: true, name: mockName };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }
    if (error.message.includes('Email not confirmed')) {
      return { success: false, error: '이메일 인증이 완료되지 않았습니다. 받은 편지함을 확인해주세요.' };
    }
    return { success: false, error: error.message };
  }

  const name = data.user?.user_metadata?.full_name ?? data.user?.email ?? '사용자';
  return { success: true, name };
}

/** 로그아웃 */
export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.auth.signOut();
}

/** 세션 복원 */
export async function getSession(): Promise<{ name: string } | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  const name = data.session.user.user_metadata?.full_name ?? data.session.user.email ?? '사용자';
  return { name };
}
